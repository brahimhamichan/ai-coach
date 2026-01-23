---
name: continue-working-on-prds
description: Continuously identifies and executes pending tasks from PRDs. Use when the user asks to "continue working", "pick up where we left off", or "process next PRD task". checks .prd and .taskmaster directories.
---

# Continue Working on PRDs

This skill helps you find the next most important task in the project's PRD (Product Requirements Document) files and start working on it.
Use this skill when the user gives broad instructions like "continue working", "do the next task", or "pick up where we left off".

## Workflow

### 1. Identify Tasks

Run the `scan_work.py` script to find all pending tasks in `.prd` and `.taskmaster` directories.

```bash
python3 .agent/skills/continue-working-on-prds/scripts/scan_work.py
```

### 2. Analyze & Prioritize

Review the JSON output from the script, which lists all pending tasks.
Select the single **highest priority** task to work on next.

**Priority Heuristics:**
1.  **Explicit Priority:** Tasks with `priority` set to "critical", "p0", "p1", or "high".
2.  **Naming Convention:** Tasks containing "critical" or "urgent" in their title.
3.  **File Type:** Prefer tasks from `prd.json` files over `.md` files, as JSON files are typically machine-generated and more up-to-date.
4.  **Order:** If no explicit priority, strictly choose the **first** pending task appearing in the list (top-down execution).

### 3. Execution Loop

Once you have selected the target task:

1.  **Announce**: Tell the user exactly what you are doing.
    > "I am picking up the next task: **[Task Title]** from `[Source File]`."

2.  **Implement**:
    - Create a mini-plan or task list if the task is complex.
    - Write the code, run tests, and verify the implementation.

3.  **Update State**:
    - Mark the task as done in the source file!
    - For Markdown: Change `[ ]` to `[x]`.
    - For JSON: Update `"status": "pending"` to `"status": "done"`.

4.  **Repeat**:
    - If the user asked to "continue" (meaning do multiple), loop back to Step 1 and find the *next* task.
    - If the user only asked for the "next task", stop here and ask for feedback.

## Scripts

### `scripts/scan_work.py`

This script scans the `.prd` and `.taskmaster` directories (and their subdirectories) for:
- `prd.json` files: Parses tasks with status != 'done'.
- `*.md` files: Parses lines starting with `- [ ]`.

It outputs a JSON list of pending tasks with their source file and line number.
