// Predefined dependency suggestions for different languages and frameworks
export const dependencySuggestions = {
  "Node.js": {
    "express-api": {
      name: "Express API",
      dependencies: [
        { name: "express", description: "Web framework for Node.js", category: "core" },
        { name: "cors", description: "CORS middleware", category: "middleware" },
        { name: "helmet", description: "Security middleware", category: "middleware" },
        { name: "dotenv", description: "Environment variables", category: "config" },
        { name: "mongoose", description: "MongoDB ODM", category: "database" },
        { name: "jsonwebtoken", description: "JWT authentication", category: "auth" },
        { name: "bcryptjs", description: "Password hashing", category: "auth" },
        { name: "joi", description: "Data validation", category: "validation" },
        { name: "winston", description: "Logging library", category: "logging" },
        { name: "jest", description: "Testing framework", category: "testing" },
        { name: "supertest", description: "HTTP testing", category: "testing" }
      ]
    },
    "react-app": {
      name: "React App",
      dependencies: [
        { name: "react", description: "UI library", category: "core" },
        { name: "react-dom", description: "React DOM rendering", category: "core" },
        { name: "vite", description: "Build tool and dev server", category: "build" },
        { name: "react-router-dom", description: "Client-side routing", category: "routing" },
        { name: "axios", description: "HTTP client", category: "http" },
        { name: "styled-components", description: "CSS-in-JS styling", category: "styling" },
        { name: "react-query", description: "Data fetching and caching", category: "data" },
        { name: "react-hook-form", description: "Form handling", category: "forms" },
        { name: "react-testing-library", description: "Testing utilities", category: "testing" },
        { name: "vitest", description: "Testing framework", category: "testing" }
      ]
    },
    "cli-tool": {
      name: "CLI Tool",
      dependencies: [
        { name: "commander", description: "Command-line interface", category: "core" },
        { name: "inquirer", description: "Interactive prompts", category: "ui" },
        { name: "chalk", description: "Terminal styling", category: "ui" },
        { name: "ora", description: "Loading spinners", category: "ui" },
        { name: "fs-extra", description: "Enhanced file system", category: "fs" },
        { name: "glob", description: "File pattern matching", category: "fs" },
        { name: "yargs", description: "Command-line argument parser", category: "cli" },
        { name: "boxen", description: "Create boxes in terminal", category: "ui" },
        { name: "update-notifier", description: "Update notifications", category: "utils" },
        { name: "jest", description: "Testing framework", category: "testing" }
      ]
    }
  },
  "Python": {
    "flask-app": {
      name: "Flask App",
      dependencies: [
        { name: "flask", description: "Web framework", category: "core" },
        { name: "flask-sqlalchemy", description: "SQLAlchemy integration", category: "database" },
        { name: "flask-migrate", description: "Database migrations", category: "database" },
        { name: "flask-cors", description: "CORS support", category: "middleware" },
        { name: "flask-jwt-extended", description: "JWT authentication", category: "auth" },
        { name: "python-dotenv", description: "Environment variables", category: "config" },
        { name: "requests", description: "HTTP library", category: "http" },
        { name: "marshmallow", description: "Serialization/validation", category: "serialization" },
        { name: "pytest", description: "Testing framework", category: "testing" },
        { name: "pytest-flask", description: "Flask testing utilities", category: "testing" },
        { name: "gunicorn", description: "WSGI server", category: "deployment" }
      ]
    },
    "django-app": {
      name: "Django App",
      dependencies: [
        { name: "django", description: "Web framework", category: "core" },
        { name: "djangorestframework", description: "REST API framework", category: "api" },
        { name: "django-cors-headers", description: "CORS support", category: "middleware" },
        { name: "django-environ", description: "Environment variables", category: "config" },
        { name: "psycopg2-binary", description: "PostgreSQL adapter", category: "database" },
        { name: "celery", description: "Task queue", category: "tasks" },
        { name: "redis", description: "Caching and sessions", category: "cache" },
        { name: "pytest-django", description: "Django testing", category: "testing" },
        { name: "factory-boy", description: "Test data generation", category: "testing" }
      ]
    }
  },
  "Java": {
    "spring-boot": {
      name: "Spring Boot",
      dependencies: [
        { name: "spring-boot-starter-web", description: "Web starter", category: "core" },
        { name: "spring-boot-starter-data-jpa", description: "JPA data access", category: "database" },
        { name: "spring-boot-starter-security", description: "Security framework", category: "security" },
        { name: "spring-boot-starter-validation", description: "Bean validation", category: "validation" },
        { name: "spring-boot-starter-test", description: "Testing starter", category: "testing" },
        { name: "mysql-connector-java", description: "MySQL connector", category: "database" },
        { name: "h2database", description: "In-memory database", category: "database" },
        { name: "lombok", description: "Code generation", category: "utils" },
        { name: "mapstruct", description: "Bean mapping", category: "utils" }
      ]
    },
    "maven-library": {
      name: "Maven Library",
      dependencies: [
        { name: "junit-jupiter", description: "Testing framework", category: "testing" },
        { name: "mockito-core", description: "Mocking framework", category: "testing" },
        { name: "slf4j-api", description: "Logging facade", category: "logging" },
        { name: "logback-classic", description: "Logging implementation", category: "logging" },
        { name: "jackson-databind", description: "JSON processing", category: "serialization" },
        { name: "apache-commons-lang3", description: "Utility library", category: "utils" }
      ]
    }
  },
  "Rust": {
    "rust-cli": {
      name: "CLI Application",
      dependencies: [
        { name: "clap", description: "Command-line argument parser", category: "cli" },
        { name: "serde", description: "Serialization framework", category: "serialization" },
        { name: "serde_json", description: "JSON support", category: "serialization" },
        { name: "tokio", description: "Async runtime", category: "async" },
        { name: "reqwest", description: "HTTP client", category: "http" },
        { name: "anyhow", description: "Error handling", category: "error" },
        { name: "thiserror", description: "Custom error types", category: "error" },
        { name: "env_logger", description: "Logging", category: "logging" },
        { name: "indicatif", description: "Progress bars", category: "ui" }
      ]
    },
    "rust-web": {
      name: "Web Server",
      dependencies: [
        { name: "actix-web", description: "Web framework", category: "core" },
        { name: "serde", description: "Serialization framework", category: "serialization" },
        { name: "serde_json", description: "JSON support", category: "serialization" },
        { name: "tokio", description: "Async runtime", category: "async" },
        { name: "sqlx", description: "SQL toolkit", category: "database" },
        { name: "redis", description: "Redis client", category: "cache" },
        { name: "jsonwebtoken", description: "JWT authentication", category: "auth" },
        { name: "bcrypt", description: "Password hashing", category: "auth" },
        { name: "tracing", description: "Structured logging", category: "logging" },
        { name: "tracing-subscriber", description: "Logging subscriber", category: "logging" }
      ]
    }
  }
};

export const getDependenciesForStructure = (language, structureId) => {
  const languageDeps = dependencySuggestions[language];
  if (!languageDeps) return null;
  
  return languageDeps[structureId] || null;
};

export const getDependencyCategories = (dependencies) => {
  const categories = {};
  dependencies.forEach(dep => {
    if (!categories[dep.category]) {
      categories[dep.category] = [];
    }
    categories[dep.category].push(dep);
  });
  return categories;
};
