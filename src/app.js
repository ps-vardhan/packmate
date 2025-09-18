import chalk from 'chalk';
import { basename, join } from 'path';
import { createConfigFile } from './utils/configUtils.js';
import { installDependencies, updateDependencyFile, validateDependencies } from './utils/dependencyUtils.js';
import { createDirectory } from './utils/fileUtils.js';
import { selectDependencies, selectLanguage, selectPackageManager, selectProjectStructure } from './utils/promptUtils.js';
import { createGitIgnore, createProjectStructure, createReadme } from './utils/structureUtils.js';

// Helper function to display success message
const success = (message) => console.log(chalk.green(`✓ ${message}`));

// Helper function to display error message
const error = (message) => console.error(chalk.red(`✗ ${message}`));

class PackmateApp {
  constructor() {
    this.projectPath = '';
    this.projectName = '';
    this.config = {};
  }

  async start() {
    try {
      await this.initializeProject();
    } catch (err) {
      error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
  }

  async initializeProject() {
    try {
      // Get project name from command line arguments or prompt
      this.projectName = process.argv[2];
      
      if (!this.projectName) {
        error('Please provide a project name. Usage: packmate <project-name>');
        process.exit(1);
      }

      this.projectPath = join(process.cwd(), this.projectName);
      
      console.log(`\n${chalk.bold.blue('📦 Packmate - Smart Package Manager')}`);
      console.log(`Creating project directory: ${chalk.bold(this.projectName)}\n`);
      
      try {
        if (createDirectory(this.projectPath)) {
          success(`Created project directory: ${chalk.bold(this.projectName)}`);
          
          // Step 3: Language/Framework Selection
          await this.selectLanguageAndPackageManager();
          
          // Step 4: Project Structure Selection
          await this.selectProjectStructure();
          
          // Step 5: Dependencies Selection
          await this.selectDependencies();
          
          console.log('\nProject setup complete!');
        } else {
          error(`A directory named "${chalk.bold(this.projectName)}" already exists.`);
          process.exit(1);
        }
      } catch (err) {
        error('Failed to create project directory');
        throw err;
      }
    } catch (err) {
      error(`Failed to initialize project: ${err.message}`);
      throw err;
    }
  }

  async selectLanguageAndPackageManager() {
    try {
      console.log(chalk.yellow('\n🔹 Step 3: Select Language/Framework'));
      
      // Select language
      const language = await selectLanguage();
      console.log(`\nYou selected: ${chalk.bold.green(language)}`);
      
      // Select package manager for the language
      const packageManager = await selectPackageManager(language);
      console.log(`Package manager: ${chalk.bold.blue(packageManager)}`);
      
      // Store the configuration
      this.config = {
        projectName: this.projectName,
        language: language,
        packageManager: packageManager,
        createdAt: new Date().toISOString()
      };
      
      const configPath = await createConfigFile(this.projectPath, this.config);
      success(`Configuration saved to: ${basename(configPath)}`);
      
    } catch (err) {
      error(`Failed to select language/package manager: ${err.message}`);
      throw err;
    }
  }

  async selectProjectStructure() {
    try {
      console.log(chalk.yellow('\n🔹 Step 4: Choose Project Structure'));
      
      // Select project structure based on language
      const structureConfig = await selectProjectStructure(this.config.language);
      
      if (structureConfig) {
        console.log(`\nSelected structure: ${chalk.bold.blue(structureConfig.description)}`);
        
        // Create the project structure
        await createProjectStructure(
          this.projectPath, 
          structureConfig.structure, 
          structureConfig.files || {}
        );
        
        success(`Created project structure with ${structureConfig.structure.length} directories`);
        
        // Create .gitignore file
        await createGitIgnore(this.projectPath, this.config.language);
        success('Created .gitignore file');
        
        // Create README.md
        await createReadme(
          this.projectPath, 
          this.projectName, 
          this.config.language, 
          structureConfig.structure
        );
        success('Created README.md file');
        
        // Update config with structure info
        this.config.structure = {
          id: structureConfig.id,
          description: structureConfig.description,
          directories: structureConfig.structure.length
        };
        
        await createConfigFile(this.projectPath, this.config);
        success('Updated configuration with structure details');
        
      } else {
        console.log(`\nUsing basic structure for ${this.config.language}`);
        
        // Create basic structure
        const basicStructure = ['src', 'tests', 'docs'];
        await createProjectStructure(this.projectPath, basicStructure);
        
        // Create .gitignore and README
        await createGitIgnore(this.projectPath, this.config.language);
        await createReadme(this.projectPath, this.projectName, this.config.language, basicStructure);
        
        success('Created basic project structure');
      }
      
    } catch (err) {
      error(`Failed to create project structure: ${err.message}`);
      throw err;
    }
  }

  async selectDependencies() {
    try {
      console.log(chalk.yellow('\n🔹 Step 5: Select Dependencies'));
      
      // Get structure ID from config
      const structureId = this.config.structure?.id;
      
      if (!structureId) {
        console.log(`\nNo structure information available. Skipping dependency selection.`);
        return;
      }
      
      // Select dependencies based on language and structure
      const selectedDeps = await selectDependencies(this.config.language, structureId);
      
      if (selectedDeps.length === 0) {
        console.log(`\nNo dependencies selected. Skipping installation.`);
        return;
      }
      
      // Validate dependencies
      const validDeps = validateDependencies(selectedDeps);
      
      if (validDeps.length === 0) {
        console.log(`\nNo valid dependencies found. Skipping installation.`);
        return;
      }
      
      console.log(`\nSelected dependencies: ${chalk.bold.blue(validDeps.join(', '))}`);
      
      // Update dependency files
      await updateDependencyFile(
        this.projectPath, 
        this.config.language, 
        this.config.packageManager, 
        validDeps
      );
      success(`Updated dependency configuration files`);
      
      // Install dependencies
      try {
        await installDependencies(
          this.projectPath, 
          this.config.language, 
          this.config.packageManager, 
          validDeps
        );
        success(`Installed ${validDeps.length} dependencies`);
      } catch (installError) {
        console.log(chalk.yellow(`\n⚠️  Dependency installation failed: ${installError.message}`));
        console.log(chalk.yellow(`You can install them manually later with:`));
        console.log(chalk.gray(`  cd ${this.projectName}`));
        console.log(chalk.gray(`  ${getInstallCommand(this.config.language, this.config.packageManager, validDeps)}`));
      }
      
      // Update config with dependency info
      this.config.dependencies = {
        selected: validDeps,
        count: validDeps.length,
        installed: true
      };
      
      await createConfigFile(this.projectPath, this.config);
      success('Updated configuration with dependency details');
      
    } catch (err) {
      error(`Failed to select dependencies: ${err.message}`);
      throw err;
    }
  }
}

const getInstallCommand = (language, packageManager, dependencies) => {
  const depsString = dependencies.join(' ');
  
  switch (language) {
    case 'Node.js':
      switch (packageManager) {
        case 'npm':
          return `npm install ${depsString}`;
        case 'yarn':
          return `yarn add ${depsString}`;
        case 'pnpm':
          return `pnpm add ${depsString}`;
        default:
          return `npm install ${depsString}`;
      }
    
    case 'Python':
      switch (packageManager) {
        case 'pip':
          return `pip install ${depsString}`;
        case 'poetry':
          return `poetry add ${depsString}`;
        case 'conda':
          return `conda install ${depsString}`;
        default:
          return `pip install ${depsString}`;
      }
    
    case 'Java':
      return `mvn install`;
    
    case 'Rust':
      return `cargo add ${depsString}`;
    
    case 'C++':
      return `vcpkg install ${depsString}`;
    
    default:
      return `See project documentation`;
  }
};

// Start the application when run directly
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const app = new PackmateApp();
  app.start().catch(console.error);
}

export default PackmateApp;
