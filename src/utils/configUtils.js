import fs from 'fs-extra';
import path from 'path';

export const createConfigFile = async (projectPath, config) => {
  const configPath = path.join(projectPath, 'packmate.json');
  await fs.writeJson(configPath, config, { spaces: 2 });
  return configPath;
};

export const readConfigFile = async (projectPath) => {
  const configPath = path.join(projectPath, 'packmate.json');
  
  if (await fs.pathExists(configPath)) {
    return await fs.readJson(configPath);
  }
  
  return null;
};

export const updateConfigFile = async (projectPath, updates) => {
  const existingConfig = await readConfigFile(projectPath) || {};
  const updatedConfig = { ...existingConfig, ...updates };
  return await createConfigFile(projectPath, updatedConfig);
};
