---
name: update-skills
description: Syncs the local .agent/skills directory with the latest skills from the brahimhamichan/skills GitHub repository.
---

# Update Skills

This skill synchronizes the local `.agent/skills` directory with the remote `brahimhamichan/skills` GitHub repository.

## When to Use

Use this skill when the user asks to:
- Update skills
- Sync skills
- Refresh skills from the repository
- Get the latest skills

## Instructions

Run the following command to update the skills:

```bash
rm -rf /tmp/skills-repo && \
git clone --depth 1 https://github.com/brahimhamichan/skills.git /tmp/skills-repo && \
rsync -av --delete --exclude .git /tmp/skills-repo/ .agent/skills/ && \
rm -rf /tmp/skills-repo
```

### What This Command Does

1. **Cleans up** any existing temporary clone at `/tmp/skills-repo`
2. **Clones** the latest version of the skills repository (shallow clone for speed)
3. **Syncs** the repository contents to `.agent/skills/`, deleting any local files not in the repo (excluding `.git`)
4. **Cleans up** the temporary clone

### Important Notes

- This will **overwrite** any local modifications to skills
- The `--delete` flag ensures removed skills are also deleted locally
- Always run from the project root directory
