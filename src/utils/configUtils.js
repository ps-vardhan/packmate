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

export const ensureLanguageConfigs = async (projectPath, language) => {
  const baseConfig = await readConfigFile(projectPath);
  const name = baseConfig?.projectName || path.basename(projectPath);
  const version = baseConfig?.version || '1.0.0';
  const author = baseConfig?.author || '';
  const license = baseConfig?.license || 'MIT';
  const description = baseConfig?.description || '';

  switch (language) {
    case 'Node.js': {
      const pkgPath = path.join(projectPath, 'package.json');
      let pkg;
      if (await fs.pathExists(pkgPath)) {
        pkg = await fs.readJson(pkgPath);
      } else {
        pkg = { name, version, description: '', main: 'index.js', scripts: { start: 'node index.js' }, dependencies: {} };
      }
      pkg.name = name;
      pkg.version = version;
      if (description) pkg.description = description;
      if (author) pkg.author = author;
      if (license) pkg.license = license;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
      break;
    }
    case 'Python': {
      const reqPath = path.join(projectPath, 'requirements.txt');
      if (!(await fs.pathExists(reqPath))) {
        await fs.writeFile(reqPath, '', 'utf8');
      }
      break;
    }
    case 'Java': {
      const pomPath = path.join(projectPath, 'pom.xml');
      if (!(await fs.pathExists(pomPath))) {
        const pom = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>${name}</artifactId>
  <version>${version}</version>
  <name>${name}</name>
  <description>${description}</description>
  <licenses>
    <license>
      <name>${license}</name>
    </license>
  </licenses>
  <developers>
    <developer>
      <name>${author}</name>
    </developer>
  </developers>
  <dependencies>
  </dependencies>
</project>`;
        await fs.writeFile(pomPath, pom, 'utf8');
      }
      break;
    }
    case 'Rust': {
      const cargoPath = path.join(projectPath, 'Cargo.toml');
      if (!(await fs.pathExists(cargoPath))) {
        const cargo = `[package]
name = "${name}"
version = "${version}"
edition = "2021"

[dependencies]
`;
        await fs.writeFile(cargoPath, cargo, 'utf8');
      }
      break;
    }
    case 'C++': {
      const vcpkgPath = path.join(projectPath, 'vcpkg.json');
      const conanPath = path.join(projectPath, 'conanfile.txt');
      if (!(await fs.pathExists(vcpkgPath)) && !(await fs.pathExists(conanPath))) {
        await fs.writeJson(vcpkgPath, { name, version: '0.1.0', dependencies: [] }, { spaces: 2 });
      }
      break;
    }
  }
};
