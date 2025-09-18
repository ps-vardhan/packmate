import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

export const initializeGitRepo = async (projectPath) => {
  try {
    // Ensure .gitignore exists to commit
    const gitignorePath = path.join(projectPath, '.gitignore');
    if (!(await fs.pathExists(gitignorePath))) {
      await fs.writeFile(gitignorePath, '', 'utf8');
    }

    const originalCwd = process.cwd();
    process.chdir(projectPath);

    try {
      execSync('git init', { stdio: 'inherit' });
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "Initial commit from PackMate"', { stdio: 'inherit' });
    } finally {
      process.chdir(originalCwd);
    }

    return true;
  } catch (error) {
    throw new Error(`Failed to initialize Git repository: ${error.message}`);
  }
};
