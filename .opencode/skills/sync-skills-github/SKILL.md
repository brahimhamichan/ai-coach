---
name: sync-skills-github
description: Syncs local skills to the GitHub repository, ensuring all local changes are pushed while preserving the remote .github folder.
---

# Sync Skills to GitHub

This skill synchronizes the local `.agent/skills` directory to the `brahimhamichan/skills` GitHub repository.

## Usage

Run the synchronization script to push local skills to GitHub.

```bash
bash .agent/skills/sync-skills-github/scripts/push.sh
```

## Description

The skill performs the following steps:
1.  **Local Sync**: Runs the local `sync-skills` script to ensure `.agent/skills` contains the latest from `.gemini/skills`.
2.  **Clone**: Clones the `brahimhamichan/skills` repository to a temporary directory.
3.  **Sync**: Uses `rsync` to update the cloned repository with the contents of `.agent/skills`.
    -   Adds new skills.
    -   Updates modified skills.
    -   **Deletes** skills from the repo that are no longer present locally.
    -   **Excludes** `.github` and `.git` from the synchronization to preserve repository configuration.
4.  **Push**: Commits and pushes any changes to the `main` branch.
