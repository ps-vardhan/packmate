import inquirer from 'inquirer';
import { getPackageManagersForLanguage, languages } from '../config/frameworks.js';

export const selectLanguage = async () => {
  const { language } = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: 'Select your project language/framework:',
      choices: languages,
      default: 'Node.js'
    }
  ]);
  
  return language;
};

export const selectPackageManager = async (language) => {
  const packageManagers = getPackageManagersForLanguage(language);
  
  if (packageManagers.length === 1) {
    console.log(`\n${language} uses ${packageManagers[0]} as its package manager.`);
    return packageManagers[0];
  }
  
  const { packageManager } = await inquirer.prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: `Which package manager do you want to use for ${language}?`,
      choices: packageManagers,
      default: packageManagers[0]
    }
  ]);
  
  return packageManager;
};
