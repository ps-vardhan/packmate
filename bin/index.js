#!/usr/bin/env node

const boxen = require('boxen').default;
const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Display introduction message
const showWelcomeMessage = () => {
  const introMessage = boxen(
    'Packmate is a smart package manager that helps you set up and manage project dependencies with ease.\n\n' +
    '✨ Features:\n' +
    '• Smart dependency management\n' +
    '• Easy project setup\n' +
    '• Cross-platform support\n\n' +
    'Type "packmate --help" to see available commands.',
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#0f172a',
      textAlignment: 'center',
      title: 'Welcome to Packmate',
      titleAlignment: 'center'
    }
  );
  console.log(introMessage);
};

const initializeProject = () => {
  readline.question('Enter your project name: ', (projectName) => {
    if (!projectName.trim()) {
      console.log('Project name cannot be empty. Please try again.');
      return initializeProject();
    }

    const projectPath = path.join(process.cwd(), projectName);
    
    // Create project directory
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
      console.log(`✅ Created project directory: ${projectName}`);
      
      // Create packmate.json
      const packmateConfig = {
        name: projectName,
        version: '1.0.0',
        description: '',
        main: 'index.js',
        scripts: {},
        keywords: [],
        author: '',
        license: 'ISC'
      };
      
      fs.writeFileSync(
        path.join(projectPath, 'packmate.json'),
        JSON.stringify(packmateConfig, null, 2)
      );
      
      console.log('✅ Created packmate.json');
      console.log(`\n🎉 Project "${projectName}" has been initialized successfully!`);
    } else {
      console.log(`A directory named "${projectName}" already exists. Please choose a different name.`);
      return initializeProject();
    }
    
    readline.close();
  });
};

// Main execution
const main = () => {
  showWelcomeMessage();
  
  // Check if running with --init flag
  if (process.argv.includes('--init')) {
    initializeProject();
  } else {
    // Show welcome message and exit if no --init flag
    readline.close();
  }
};

main();
