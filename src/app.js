import chalk from 'chalk';
import { basename, join } from 'path';
import { createConfigFile } from './utils/configUtils.js';
import { createDirectory } from './utils/fileUtils.js';
import { selectLanguage, selectPackageManager } from './utils/promptUtils.js';

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
}

// Start the application when run directly
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const app = new PackmateApp();
  app.start().catch(console.error);
}

export default PackmateApp;
