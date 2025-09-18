import inquirer from 'inquirer';
import { getPackageManagersForLanguage, languages } from '../config/frameworks.js';
import { getStructureChoices } from '../config/structures.js';

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

export const selectProjectStructure = async (language) => {
  const structureChoices = getStructureChoices(language);
  
  if (structureChoices.length === 0) {
    console.log(`\nNo predefined structures available for ${language}. Using basic structure.`);
    return null;
  }
  
  if (structureChoices.length === 1) {
    console.log(`\nUsing default structure for ${language}: ${structureChoices[0].name}`);
    return structureChoices[0].config;
  }
  
  const { structure } = await inquirer.prompt([
    {
      type: 'list',
      name: 'structure',
      message: `Choose a project structure for ${language}:`,
      choices: structureChoices,
      default: structureChoices[0].value
    }
  ]);
  
  // Find the selected structure config
  const selectedStructure = structureChoices.find(choice => choice.value === structure);
  return selectedStructure ? selectedStructure.config : null;
};
