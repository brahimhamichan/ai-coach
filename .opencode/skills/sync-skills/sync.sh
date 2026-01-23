#!/bin/bash

# Ensure directories exist
mkdir -p .agent/skills
mkdir -p .gemini/skills

echo "Syncing skills from .gemini to .agent..."
rsync -avu --progress .gemini/skills/ .agent/skills/

echo "Syncing skills from .agent to .gemini..."
rsync -avu --progress .agent/skills/ .gemini/skills/

echo "Sync complete. Both directories now contain the union of skills."
