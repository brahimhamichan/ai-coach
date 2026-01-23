
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const envFilePath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envFilePath)) {
    console.error('❌ .env.local file not found!');
    process.exit(1);
}

const envContent = fs.readFileSync(envFilePath, 'utf-8');
const lines = envContent.split('\n');

console.log('🚀 Pushing environment variables to Convex...');

let count = 0;

for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
    }

    const [key, ...valueParts] = trimmedLine.split('=');
    const value = valueParts.join('=');

    if (!key || !value) {
        continue;
    }

    // Skip local deployment config variables
    if (key === 'CONVEX_DEPLOYMENT' || key === 'NEXT_PUBLIC_CONVEX_URL') {
        continue;
    }

    try {
        // Quote the value to handle spaces or special characters
        const command = `npx convex env set ${key}="${value}"`;
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ Set ${key}`);
        count++;
    } catch (error) {
        console.error(`❌ Failed to set ${key}`, error);
    }
}

console.log(`\n✨ Successfully pushed ${count} environment variables to Convex!`);
