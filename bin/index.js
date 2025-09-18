#!/usr/bin/env node

import { createRequire } from 'module';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the main application
let PackmateApp;
try {
  const appPath = new URL('../src/app.js', import.meta.url).href;
  const appModule = await import(appPath);
  PackmateApp = appModule.default;
} catch (error) {
  console.error('❌ Failed to load the application:', error.message);
  process.exit(1);
}

// Handle command line arguments
const args = process.argv.slice(2);

// Show help if no arguments or --help flag is provided
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: packmate <project-name>

Initialize a new project with the given name.

Example:
  packmate my-project    Create a new project named 'my-project'
  `);
  process.exit(0);
}

// Start the application
const app = new PackmateApp();
app.start().catch(console.error);