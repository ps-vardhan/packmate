#!/usr/bin/env node

import { createRequire } from 'module';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load package version
let version = '1.0.0';
try {
  const pkg = require('../package.json');
  version = pkg.version || version;
} catch {}

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
  console.log(`\n📦 PackMate v${version}`);
  console.log('PackMate is a smart package manager that helps you set up and manage project dependencies with ease.');
  console.log('Supports multiple languages and generates clean project structures.');
  console.log(`\nUsage: packmate <project-name>\n`);
  console.log('Initialize a new project with the given name.');
  console.log(`\nExample:\n  packmate my-project    Create a new project named 'my-project'\n`);
  process.exit(0);
}

// Always show a small banner before starting
console.log(`\n📦 PackMate v${version}`);

// Start the application
const app = new PackmateApp();
app.start().catch(console.error);