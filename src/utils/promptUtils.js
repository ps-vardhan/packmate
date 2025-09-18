import inquirer from 'inquirer';
import { getDependenciesForStructure, getDependencyCategories } from '../config/dependencies.js';
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

export const selectDependencies = async (language, structureId) => {
  const dependencyConfig = getDependenciesForStructure(language, structureId);
  
  if (!dependencyConfig) {
    console.log(`\nNo predefined dependencies available for ${language} ${structureId}.`);
    return await getCustomDependencies();
  }
  
  const { dependencies } = dependencyConfig;
  const categories = getDependencyCategories(dependencies);
  
  // Group dependencies by category for better organization
  const choices = [];
  Object.entries(categories).forEach(([category, deps]) => {
    choices.push(new inquirer.Separator(`\n${category.toUpperCase()}`));
    deps.forEach(dep => {
      choices.push({
        name: `${dep.name} - ${dep.description}`,
        value: dep.name,
        checked: dep.category === 'core' || dep.category === 'testing' // Auto-select core and testing deps
      });
    });
  });
  
  const { selectedDeps } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedDeps',
      message: `Select dependencies for ${dependencyConfig.name}:`,
      choices: choices,
      pageSize: 15
    }
  ]);
  
  // Ask for custom dependencies
  const { customDeps } = await inquirer.prompt([
    {
      type: 'input',
      name: 'customDeps',
      message: 'Add custom dependencies (comma-separated, optional):',
      default: ''
    }
  ]);
  
  // Combine selected and custom dependencies
  const customDepsList = customDeps
    .split(',')
    .map(dep => dep.trim())
    .filter(dep => dep.length > 0);
  
  return [...selectedDeps, ...customDepsList];
};

const getCustomDependencies = async () => {
  const { customDeps } = await inquirer.prompt([
    {
      type: 'input',
      name: 'customDeps',
      message: 'Enter dependencies (comma-separated):',
      validate: (input) => {
        if (!input.trim()) {
          return 'Please enter at least one dependency';
        }
        return true;
      }
    }
  ]);
  
  return customDeps
    .split(',')
    .map(dep => dep.trim())
    .filter(dep => dep.length > 0);
};
