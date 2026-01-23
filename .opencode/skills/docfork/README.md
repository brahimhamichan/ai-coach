# Docfork Agent Skill

This skill allows AI agents to search and read documentation directly from [docfork.com](https://docfork.com), enabling them to access up-to-date documentation and code examples for any library.

> **Note:** This skill is based on the [Docfork MCP Server](https://github.com/docfork/docfork-mcp).

## Prerequisites

- Node.js (v18 or higher recommended)
- A Docfork API Key (optional, but recommended for higher limits)

## Installation

This skill is designed to be used with AI agent frameworks. Ensure the `scripts` directory and `package.json` are placed within your agent's skill directory.

Run dependencies installation:

```bash
npm install
```

## Usage

This skill provides two main tools: `search_docs` and `read_url`.

### 1. search_docs

Search for documentation across libraries.

**Command:**

```bash
node scripts/search_docs.js "<query>" [libraryId] [tokens]
```

- `query`: The search query (required).
- `libraryId`: Specific library identifier in `author/repo` format (e.g., `facebook/react`) (optional).
- `tokens`: Token budget (default: dynamic) (optional).

**Example:**

```bash
node scripts/search_docs.js "useEffect hook" "facebook/react"
```

### 2. read_url

Fetch the full content of a specific documentation page.

**Command:**

```bash
node scripts/read_url.js "<url>"
```

- `url`: The full URL to read (required).

**Example:**

```bash
node scripts/read_url.js "https://react.dev/reference/react/useEffect"
```

## Environment Variables

You can configure the skill using the following environment variables:

- `DOCFORK_API_KEY`: Your Docfork API Key.
- `DOCFORK_CABINET`: A specific Cabinet ID to search within.

## License

ISC
