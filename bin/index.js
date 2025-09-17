#!/usr/bin/env node

const boxen = require('boxen').default;
const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const { execSync } = require('child_process');

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

const selectFramework = (projectPath, projectName) => {
  console.log('\n📦 Select a framework and package manager:');
  console.log('1. Node.js (npm)')
  console.log('2. Node.js (yarn)')
  console.log('3. Node.js (pnpm)')
  console.log('4. Python (pip)')
  console.log('5. Python (poetry)')
  console.log('6. Java (Maven)')
  console.log('7. Java (Gradle)')
  console.log('8. C++ (vcpkg)')
  console.log('9. C++ (conan)')
  console.log('10. Rust (cargo)')
  
  readline.question('\nEnter your choice (1-10): ', (choice) => {
    const config = {
      name: projectName,
      version: '1.0.0',
      description: '',
      main: 'index.js',
      scripts: {},
      keywords: [],
      author: '',
      license: 'ISC',
      framework: {}
    };

    try {
      switch(choice) {
        case '1':
          config.framework = { type: 'nodejs', packageManager: 'npm' };
          fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
            name: projectName.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            description: '',
            main: 'index.js',
            scripts: { start: 'node index.js' },
            keywords: [],
            author: '',
            license: 'ISC'
          }, null, 2));
          console.log('✅ Created package.json for Node.js (npm)');
          break;
          
        case '2':
          config.framework = { type: 'nodejs', packageManager: 'yarn' };
          fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
            name: projectName.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            private: true,
            workspaces: ['packages/*']
          }, null, 2));
          console.log('✅ Created package.json for Node.js (yarn)');
          break;
          
        case '3':
          config.framework = { type: 'nodejs', packageManager: 'pnpm' };
          fs.writeFileSync(path.join(projectPath, 'pnpm-workspace.yaml'), 'packages:\n  - "packages/*"\n');
          fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
            name: projectName.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            private: true,
            scripts: {}
          }, null, 2));
          console.log('✅ Created package.json for Node.js (pnpm)');
          break;
          
        case '4':
          config.framework = { type: 'python', packageManager: 'pip' };
          fs.writeFileSync(path.join(projectPath, 'requirements.txt'), '# Add your Python dependencies here\n');
          console.log('✅ Created requirements.txt for Python (pip)');
          break;
          
        case '5':
          config.framework = { type: 'python', packageManager: 'poetry' };
          fs.writeFileSync(path.join(projectPath, 'pyproject.toml'), 
            `[tool.poetry]\nname = "${projectName.toLowerCase().replace(/\s+/g, '-')}"\nversion = "0.1.0"\ndescription = ""\nauthors = ["Your Name <your.email@example.com>"]\n`);
          console.log('✅ Created pyproject.toml for Python (poetry)');
          break;
          
        case '6':
          config.framework = { type: 'java', packageManager: 'maven' };
          const mavenDir = path.join(projectPath, 'src', 'main', 'java', projectName.replace(/[^a-zA-Z0-9]/g, ''));
          fs.mkdirSync(mavenDir, { recursive: true });
          fs.writeFileSync(path.join(projectPath, 'pom.xml'), 
            `<?xml version="1.0" encoding="UTF-8"?>\n<project xmlns="http://maven.apache.org/POM/4.0.0"\n         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">\n    <modelVersion>4.0.0</modelVersion>\n\n    <groupId>com.example</groupId>\n    <artifactId>${projectName.toLowerCase().replace(/\s+/g, '-')}</artifactId>\n    <version>1.0-SNAPSHOT</version>\n\n</project>`);
          console.log('✅ Created Maven project structure');
          break;
          
        case '7':
          config.framework = { type: 'java', packageManager: 'gradle' };
          fs.mkdirSync(path.join(projectPath, 'src', 'main', 'java'), { recursive: true });
          fs.mkdirSync(path.join(projectPath, 'src', 'test', 'java'), { recursive: true });
          fs.writeFileSync(path.join(projectPath, 'build.gradle'), 
            `plugins {\n    id 'java'\n}\n\nrepositories {\n    mavenCentral()\n}\n\ndependencies {\n    testImplementation 'org.junit.jupiter:junit-jupiter:5.7.0'\n}\n\ntest {\n    useJUnitPlatform()\n}`);
          console.log('✅ Created Gradle project structure');
          break;
          
        case '8':
          config.framework = { type: 'cpp', packageManager: 'vcpkg' };
          fs.writeFileSync(path.join(projectPath, 'vcpkg.json'), 
            JSON.stringify({
              name: projectName.toLowerCase().replace(/\s+/g, '-'),
              version: '0.1.0',
              dependencies: []
            }, null, 2));
          console.log('✅ Created vcpkg.json for C++ (vcpkg)');
          break;
          
        case '9':
          config.framework = { type: 'cpp', packageManager: 'conan' };
          fs.writeFileSync(path.join(projectPath, 'conanfile.txt'), 
            `[requires]\n\n[generators]\ncmake`);
          console.log('✅ Created conanfile.txt for C++ (conan)');
          break;
          
        case '10':
          config.framework = { type: 'rust', packageManager: 'cargo' };
          // Create a simple Cargo.toml
          fs.writeFileSync(path.join(projectPath, 'Cargo.toml'), 
            `[package]\nname = "${projectName.toLowerCase().replace(/\s+/g, '-')}"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]`);
          // Create a simple main.rs
          fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
          fs.writeFileSync(path.join(projectPath, 'src', 'main.rs'), 
            'fn main() {\n    println!("Hello, world!");\n}');
          console.log('✅ Created Rust project with Cargo');
          break;
          
        default:
          console.log('❌ Invalid choice. Please try again.');
          return selectFramework(projectPath, projectName);
      }
      
      // Save the packmate configuration
      fs.writeFileSync(
        path.join(projectPath, 'packmate.json'),
        JSON.stringify(config, null, 2)
      );
      
      console.log(`\n🎉 Project "${projectName}" has been initialized successfully with your selected framework!`);
      console.log('\nNext steps:');
      console.log(`1. cd ${projectName}`);
      
      // Show framework-specific next steps
      if (choice === '1' || choice === '2' || choice === '3') {
        console.log('2. Install dependencies: ' + (choice === '1' ? 'npm install' : choice === '2' ? 'yarn' : 'pnpm install'));
        console.log('3. Start development: ' + (choice === '1' ? 'npm start' : choice === '2' ? 'yarn start' : 'pnpm start'));
      } else if (choice === '4' || choice === '5') {
        console.log('2. Install dependencies: ' + (choice === '4' ? 'pip install -r requirements.txt' : 'poetry install'));
      } else if (choice === '6' || choice === '7') {
        console.log('2. Open the project in your favorite Java IDE');
      } else if (choice === '8' || choice === '9') {
        console.log('2. Follow the setup instructions for your C++ build system');
      } else if (choice === '10') {
        console.log('2. Build and run: cargo run');
      }
      
    } catch (error) {
      console.error('❌ Error setting up project:', error.message);
    } finally {
      readline.close();
    }
  });
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
      
      // Proceed to framework selection
      selectFramework(projectPath, projectName);
    } else {
      console.log(`A directory named "${projectName}" already exists. Please choose a different name.`);
      return initializeProject();
    }
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
