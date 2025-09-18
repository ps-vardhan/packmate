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

// Help flag prints help and exits
if (args.includes('--help') || args.includes('-h')) {
  console.log(`\n📦 PackMate v${version}`);
  console.log('PackMate is a smart package manager that helps you set up and manage project dependencies with ease.');
  console.log('Supports multiple languages and generates clean project structures.');
  console.log(`\nUsage: packmate <project-name>\n`);
  console.log('If <project-name> is omitted, you will be prompted for it.');
  console.log(`\nExample:\n  packmate my-project\n  pm my-project\n`);
  process.exit(0);
}

// Beautified banner at start of initialization
try {
  const boxen = (await import('boxen')).default;
  const bannerText = `PackMate v${version}\n\nPackmate a smart package manager that helps you set up and manage project dependencies with ease.\nSupports multiple languages and generates clean project structures.`;
  const banner = boxen(bannerText, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
    title: 'PackMate',
    titleAlignment: 'center'
  });
  console.log(banner);
} catch {
  console.log(`\n📦 PackMate v${version}`);
  console.log('Packmate a smart package manager that helps you set up and manage project dependencies with ease.');
  console.log('Supports multiple languages and generates clean project structures.');
}

// Start the application (no-arg allowed; app will prompt for metadata)
const app = new PackmateApp();
app.start().catch(console.error);