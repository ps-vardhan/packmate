import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

export const installDependencies = async (projectPath, language, packageManager, dependencies) => {
  try {
    const installCommand = getInstallCommand(language, packageManager, dependencies);
    
    console.log(`\nInstalling dependencies with ${packageManager}...`);
    console.log(`Command: ${installCommand}`);
    
    // Change to project directory and run install command
    const originalCwd = process.cwd();
    process.chdir(projectPath);
    
    try {
      execSync(installCommand, { 
        stdio: 'inherit',
        cwd: projectPath
      });
    } finally {
      process.chdir(originalCwd);
    }
    
    return true;
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error.message}`);
  }
};

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
      // For Java, we need to modify pom.xml or build.gradle
      // This is handled separately in updateJavaDependencies
      return null;
    
    case 'Rust':
      return `cargo add ${depsString}`;
    
    case 'C++':
      // C++ dependencies are handled through vcpkg.json or conanfile.txt
      return null;
    
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};

export const updateDependencyFile = async (projectPath, language, packageManager, dependencies) => {
  try {
    switch (language) {
      case 'Node.js':
        await updatePackageJson(projectPath, dependencies);
        break;
      
      case 'Python':
        await updatePythonDependencies(projectPath, packageManager, dependencies);
        break;
      
      case 'Java':
        await updateJavaDependencies(projectPath, packageManager, dependencies);
        break;
      
      case 'Rust':
        await updateCargoToml(projectPath, dependencies);
        break;
      
      case 'C++':
        await updateCppDependencies(projectPath, packageManager, dependencies);
        break;
    }
    
    return true;
  } catch (error) {
    throw new Error(`Failed to update dependency file: ${error.message}`);
  }
};

const updatePackageJson = async (projectPath, dependencies) => {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    
    // Add dependencies to package.json
    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }
    
    dependencies.forEach(dep => {
      packageJson.dependencies[dep] = 'latest';
    });
    
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  } else {
    // Create basic package.json if it doesn't exist
    const packageJson = {
      name: path.basename(projectPath),
      version: '1.0.0',
      description: '',
      main: 'index.js',
      scripts: {
        start: 'node index.js'
      },
      dependencies: {}
    };
    
    dependencies.forEach(dep => {
      packageJson.dependencies[dep] = 'latest';
    });
    
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }
};

const updatePythonDependencies = async (projectPath, packageManager, dependencies) => {
  if (packageManager === 'poetry') {
    // For Poetry, we'll add to pyproject.toml
    const pyprojectPath = path.join(projectPath, 'pyproject.toml');
    
    if (await fs.pathExists(pyprojectPath)) {
      let content = await fs.readFile(pyprojectPath, 'utf8');
      
      // Add dependencies to [tool.poetry.dependencies] section
      if (!content.includes('[tool.poetry.dependencies]')) {
        content += '\n[tool.poetry.dependencies]\n';
      }
      
      dependencies.forEach(dep => {
        if (!content.includes(dep)) {
          content += `${dep} = "*"\n`;
        }
      });
      
      await fs.writeFile(pyprojectPath, content);
    }
  } else {
    // For pip, create/update requirements.txt
    const requirementsPath = path.join(projectPath, 'requirements.txt');
    
    let existingDeps = [];
    if (await fs.pathExists(requirementsPath)) {
      const content = await fs.readFile(requirementsPath, 'utf8');
      existingDeps = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    }
    
    const allDeps = [...new Set([...existingDeps, ...dependencies])];
    await fs.writeFile(requirementsPath, allDeps.join('\n') + '\n');
  }
};

const updateJavaDependencies = async (projectPath, packageManager, dependencies) => {
  if (packageManager === 'maven') {
    const pomPath = path.join(projectPath, 'pom.xml');
    
    if (await fs.pathExists(pomPath)) {
      let content = await fs.readFile(pomPath, 'utf8');
      
      // Add dependencies to <dependencies> section
      if (content.includes('<dependencies>')) {
        const dependencyXml = dependencies.map(dep => 
          `        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>${dep}</artifactId>
        </dependency>`
        ).join('\n');
        
        content = content.replace(
          '</dependencies>',
          dependencyXml + '\n    </dependencies>'
        );
        
        await fs.writeFile(pomPath, content);
      }
    }
  } else if (packageManager === 'gradle') {
    const buildGradlePath = path.join(projectPath, 'build.gradle');
    
    if (await fs.pathExists(buildGradlePath)) {
      let content = await fs.readFile(buildGradlePath, 'utf8');
      
      // Add dependencies to dependencies block
      const dependencyLines = dependencies.map(dep => 
        `    implementation 'org.springframework.boot:${dep}'`
      ).join('\n');
      
      if (content.includes('dependencies {')) {
        content = content.replace(
          '}',
          dependencyLines + '\n}'
        );
      }
      
      await fs.writeFile(buildGradlePath, content);
    }
  }
};

const updateCargoToml = async (projectPath, dependencies) => {
  const cargoTomlPath = path.join(projectPath, 'Cargo.toml');
  
  if (await fs.pathExists(cargoTomlPath)) {
    let content = await fs.readFile(cargoTomlPath, 'utf8');
    
    // Add dependencies to [dependencies] section
    if (!content.includes('[dependencies]')) {
      content += '\n[dependencies]\n';
    }
    
    dependencies.forEach(dep => {
      if (!content.includes(dep)) {
        content += `${dep} = "*"\n`;
      }
    });
    
    await fs.writeFile(cargoTomlPath, content);
  }
};

const updateCppDependencies = async (projectPath, packageManager, dependencies) => {
  if (packageManager === 'vcpkg') {
    const vcpkgPath = path.join(projectPath, 'vcpkg.json');
    
    if (await fs.pathExists(vcpkgPath)) {
      const vcpkgJson = await fs.readJson(vcpkgPath);
      
      if (!vcpkgJson.dependencies) {
        vcpkgJson.dependencies = [];
      }
      
      dependencies.forEach(dep => {
        if (!vcpkgJson.dependencies.includes(dep)) {
          vcpkgJson.dependencies.push(dep);
        }
      });
      
      await fs.writeJson(vcpkgPath, vcpkgJson, { spaces: 2 });
    }
  } else if (packageManager === 'conan') {
    const conanfilePath = path.join(projectPath, 'conanfile.txt');
    
    if (await fs.pathExists(conanfilePath)) {
      let content = await fs.readFile(conanfilePath, 'utf8');
      
      if (!content.includes('[requires]')) {
        content = '[requires]\n' + content;
      }
      
      dependencies.forEach(dep => {
        if (!content.includes(dep)) {
          content += `${dep}\n`;
        }
      });
      
      await fs.writeFile(conanfilePath, content);
    }
  }
};

export const validateDependencies = (dependencies) => {
  return dependencies.filter(dep => {
    const trimmed = dep.trim();
    return trimmed.length > 0 && !trimmed.includes(' ');
  });
};
