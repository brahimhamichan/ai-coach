
import { fileURLToPath } from 'url';

const API_URL = "https://api.docfork.com/v1";

function getHeaders(auth) {
    const headers = {
        "User-Agent": "docfork-mcp-script",
        "Content-Type": "application/json",
        "accept": "application/json",
    };

    if (auth?.apiKey) {
        headers["Authorization"] = `Bearer ${auth.apiKey}`;
    }

    if (auth?.cabinet) {
        headers["X-Docfork-Cabinet"] = auth.cabinet;
    }

    return headers;
}

async function readUrl(urlToRead, auth) {
    const url = new URL(`${API_URL}/read`);
    url.searchParams.set("url", urlToRead);

    const headers = getHeaders(auth);

    try {
        const response = await fetch(url.toString(), {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 500)}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error reading URL:", error.message);
        process.exit(1);
    }
}

// Main execution
const currentPath = fileURLToPath(import.meta.url);
const entryPath = process.argv[1];

if (currentPath === entryPath) {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error("Usage: node read_url.js <url>");
        process.exit(1);
    }

    const urlToRead = args[0];

    const auth = {
        apiKey: process.env.DOCFORK_API_KEY,
        cabinet: process.env.DOCFORK_CABINET,
    };

    readUrl(urlToRead, auth).then((result) => {
        console.log(JSON.stringify(result, null, 2));
    });
}
