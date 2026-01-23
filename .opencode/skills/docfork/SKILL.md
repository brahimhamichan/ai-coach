---
name: docfork
description: Search and read documentation from docfork.com to find up-to-date documentation and code examples for any library.
---

# Docfork

This skill provides tools to search and read documentation from [docfork.com](https://docfork.com).
It allows agents to find up-to-date documentation and code examples for any library.

## Tools

### search_docs

Search for documentation.

**Usage:**
```javascript
node scripts/search_docs.js "<query>" [libraryId] [tokens]
```

- `query`: The search query (required).
- `libraryId`: Specific library identifier in `author/repo` format (optional).
- `tokens`: Token budget (optional).

**Environment Variables:**
- `DOCFORK_API_KEY`: API Key (optional).
- `DOCFORK_CABINET`: Cabinet ID (optional).

### read_url

Read a specific documentation page.

**Usage:**
```javascript
node scripts/read_url.js "<url>"
```

- `url`: The full URL to read (required).

**Environment Variables:**
- `DOCFORK_API_KEY`: API Key (optional).
- `DOCFORK_CABINET`: Cabinet ID (optional).
