# Sync Skills

This skill synchronizes the `skills` directories between `.gemini` and `.agent` folders, ensuring that skills available in one location are available in the other.

## Usage

Run the synchronization script to merge skills from both locations.

```bash
bash .gemini/skills/sync-skills/sync.sh
```

## Description

The skill ensures:
1.  `.agent/skills` and `.gemini/skills` directories exist.
2.  Copies new/updated skills from `.gemini` to `.agent`.
3.  Copies new/updated skills from `.agent` to `.gemini`.
