import { existsSync, mkdirSync } from 'fs';

export const createDirectory = (dirPath) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
};
