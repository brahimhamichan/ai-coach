import os
import json
import re

def scan_work(root_dir):
    pending_tasks = []
    
    # Define roots to look into
    search_dirs = ['.prd', '.taskmaster']
    roots = [os.path.join(root_dir, d) for d in search_dirs]
    
    for r in roots:
        if not os.path.exists(r):
            continue
            
        for dirpath, dirnames, filenames in os.walk(r):
            for f in filenames:
                full_path = os.path.join(dirpath, f)
                rel_path = os.path.relpath(full_path, root_dir)
                
                if f == 'prd.json':
                    try:
                        with open(full_path, 'r') as json_file:
                            data = json.load(json_file)
                            # Support common JSON PRD structures
                            task_list = []
                            if isinstance(data, dict):
                                if 'tasks' in data and isinstance(data['tasks'], list):
                                    task_list = data['tasks']
                                elif 'features' in data and isinstance(data['features'], list):
                                    task_list = data['features']
                            elif isinstance(data, list):
                                task_list = data
                                
                            for task in task_list:
                                if isinstance(task, dict):
                                    status = task.get('status', '').lower()
                                    if status not in ['done', 'completed', 'verified', 'fixed', 'closed']:
                                        pending_tasks.append({
                                            'source': rel_path,
                                            'type': 'json',
                                            'content': task.get('title') or task.get('description') or task.get('name') or str(task)[:100],
                                            'priority': task.get('priority', 'unknown')
                                        })
                    except Exception as e:
                        print(f"Error parsing {rel_path}: {e}", file=sys.stderr)
                
                elif f.endswith('.md'):
                    try:
                        with open(full_path, 'r') as md_file:
                            lines = md_file.readlines()
                            for i, line in enumerate(lines):
                                stripped = line.strip()
                                # Matches "- [ ]", "* [ ]", "1. [ ]"
                                if re.match(r'^[-*1-9]+\.?\s*\[\s*\]', stripped):
                                    content = re.sub(r'^[-*1-9]+\.?\s*\[\s*\]', '', stripped).strip()
                                    pending_tasks.append({
                                        'source': rel_path,
                                        'type': 'markdown',
                                        'line': i + 1,
                                        'content': content,
                                        'priority': 'unknown'
                                    })
                    except Exception as e:
                         print(f"Error reading {rel_path}: {e}", file=sys.stderr)

    return pending_tasks

if __name__ == "__main__":
    import sys
    # Use current working directory
    root = os.getcwd() 
    tasks = scan_work(root)
    print(json.dumps(tasks, indent=2))
