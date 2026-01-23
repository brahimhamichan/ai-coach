#!/bin/bash
set -e

# Define paths
SKILLS_REPO_URL="https://github.com/brahimhamichan/skills.git"
TEMP_DIR="/tmp/skills-repo-$(date +%s)"
LOCAL_SKILLS_DIR=".agent/skills/"
LOCAL_SYNC_SCRIPT=".agent/skills/sync-skills/sync.sh"

# Ensure we are in the project root
if [ ! -d ".agent/skills" ]; then
    echo "Error: Must be run from the project root directory."
    exit 1
fi

# Step 1: Run local sync if available
if [ -f "$LOCAL_SYNC_SCRIPT" ]; then
    echo "Running local skills sync..."
    bash "$LOCAL_SYNC_SCRIPT"
else
    echo "Warning: Local sync script not found at $LOCAL_SYNC_SCRIPT. Skipping local sync."
fi

# Step 2: Clone the repository
echo "Cloning skills repository..."
git clone --depth 1 "$SKILLS_REPO_URL" "$TEMP_DIR"

# Step 3: Rsync to the repository
echo "Syncing local skills to repository..."
# -a: archive mode
# -v: verbose
# --delete: delete extraneous files from dest dirs
# --exclude: exclude matching files
rsync -av --delete \
    --exclude ".git" \
    --exclude ".github" \
    "$LOCAL_SKILLS_DIR" "$TEMP_DIR/"

# Step 4: Commit and Push
cd "$TEMP_DIR"

if [ -n "$(git status --porcelain)" ]; then
    echo "Changes detected. Committing and pushing..."
    git add .
    git commit -m "Update skills: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
    echo "Successfully pushed updates to GitHub."
else
    echo "No changes detected. Nothing to push."
fi

# Cleanup
cd - > /dev/null
rm -rf "$TEMP_DIR"
echo "Cleanup complete."
