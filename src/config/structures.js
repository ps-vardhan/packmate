// Project structure templates for different languages and frameworks
export const structureTemplates = {
  "Node.js": {
    "Express API": {
      id: "express-api",
      description: "RESTful API with Express.js framework",
      structure: [
        "src/controllers",
        "src/routes", 
        "src/models",
        "src/middleware",
        "src/utils",
        "src/config",
        "tests/unit",
        "tests/integration",
        "public",
        "docs"
      ],
      files: {
        "src/app.js": `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;`,
        "src/routes/index.js": `const express = require('express');
const router = express.Router();

// Import route modules
// const userRoutes = require('./users');
// const authRoutes = require('./auth');

// Use routes
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'API Routes' });
});

module.exports = router;`,
        "src/controllers/index.js": `// Controller functions go here

const getHealth = (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
};

module.exports = {
  getHealth
};`,
        "src/models/index.js": `// Database models go here

// Example model structure
class BaseModel {
  constructor(data) {
    Object.assign(this, data);
  }
}

module.exports = {
  BaseModel
};`,
        "tests/unit/example.test.js": `const request = require('supertest');
const app = require('../../src/app');

describe('GET /', () => {
  it('should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });
});`,
        ".gitignore": `node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
coverage/
.nyc_output/
dist/
build/`,
        "README.md": `# Express API

A RESTful API built with Express.js

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

3. The API will be available at http://localhost:3000

## Project Structure

- \`src/controllers/\` - Route handlers
- \`src/routes/\` - Route definitions
- \`src/models/\` - Data models
- \`src/middleware/\` - Custom middleware
- \`tests/\` - Test files

## API Endpoints

- \`GET /\` - Welcome message
- \`GET /health\` - Health check`
      }
    },
    "React App": {
      id: "react-app",
      description: "Single Page Application with React",
      structure: [
        "src/components",
        "src/pages",
        "src/hooks",
        "src/utils",
        "src/services",
        "src/assets/images",
        "src/assets/styles",
        "public",
        "tests"
      ],
      files: {
        "src/App.js": `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to React</h1>
        <p>Start building your application!</p>
      </header>
    </div>
  );
}

export default App;`,
        "src/App.css": `/* App styles */
.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}`,
        "src/index.js": `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        "public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,
        ".gitignore": `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*`
      }
    },
    "CLI Tool": {
      id: "cli-tool",
      description: "Command Line Interface application",
      structure: [
        "src/commands",
        "src/utils",
        "src/config",
        "tests",
        "docs"
      ],
      files: {
        "src/index.js": `#!/usr/bin/env node

const { Command } = require('commander');
const packageJson = require('../package.json');

const program = new Command();

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version);

// Add commands here
program
  .command('hello')
  .description('Say hello')
  .action(() => {
    console.log('Hello from your CLI tool!');
  });

program.parse();`,
        "src/commands/index.js": `// Command definitions go here

const helloCommand = {
  name: 'hello',
  description: 'Say hello',
  action: () => {
    console.log('Hello!');
  }
};

module.exports = {
  helloCommand
};`,
        ".gitignore": `node_modules/
.env
.DS_Store
*.log
dist/
build/`
      }
    }
  },
  "Python": {
    "Flask App": {
      id: "flask-app",
      description: "Web application with Flask framework",
      structure: [
        "app",
        "app/routes",
        "app/models", 
        "app/templates",
        "app/static",
        "app/static/css",
        "app/static/js",
        "tests",
        "instance"
      ],
      files: {
        "app/__init__.py": `from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = 'your-secret-key-here'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    from app.routes import main
    app.register_blueprint(main)
    
    return app`,
        "app/routes/__init__.py": `from flask import Blueprint

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return {'message': 'Welcome to Flask API'}

@main.route('/health')
def health():
    return {'status': 'OK'}`
      }
    },
    "Django App": {
      id: "django-app", 
      description: "Web application with Django framework",
      structure: [
        "myproject",
        "myproject/settings",
        "myapp",
        "myapp/models",
        "myapp/views",
        "myapp/templates",
        "myapp/static",
        "tests"
      ],
      files: {
        "manage.py": `#!/usr/bin/env python
import os
import sys

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings.development')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)`
      }
    }
  },
  "Java": {
    "Spring Boot": {
      id: "spring-boot",
      description: "RESTful API with Spring Boot framework",
      structure: [
        "src/main/java/com/example/demo",
        "src/main/resources",
        "src/test/java/com/example/demo",
        "src/test/resources"
      ],
      files: {
        "src/main/java/com/example/demo/DemoApplication.java": `package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}`,
        "src/main/java/com/example/demo/controller/HelloController.java": `package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    
    @GetMapping("/")
    public String hello() {
        return "Hello from Spring Boot!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}`
      }
    },
    "Maven Library": {
      id: "maven-library",
      description: "Java library with Maven build system",
      structure: [
        "src/main/java/com/example/library",
        "src/main/resources",
        "src/test/java/com/example/library"
      ]
    }
  },
  "Rust": {
    "CLI Application": {
      id: "rust-cli",
      description: "Command Line Interface with Rust",
      structure: [
        "src",
        "src/bin",
        "tests",
        "examples"
      ],
      files: {
        "Cargo.toml": `[package]
name = "rust-cli"
version = "0.1.0"
edition = "2021"

[dependencies]
clap = { version = "4.0", features = ["derive"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"`,
        "src/main.rs": `use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    
    if args.len() > 1 {
        println!("Hello, {}!", args[1]);
    } else {
        println!("Hello, world!");
    }
}`,
        "src/lib.rs": `//! My Rust Library
//! 
//! This is a simple Rust library.

/// Greet someone by name
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        assert_eq!(greet("World"), "Hello, World!");
    }
}`
      }
    },
    "Web Server": {
      id: "rust-web",
      description: "Web server with Actix-web framework",
      structure: [
        "src",
        "src/handlers",
        "src/models",
        "src/routes",
        "tests"
      ],
      files: {
        "Cargo.toml": `[package]
name = "rust-web"
version = "0.1.0"
edition = "2021"

[dependencies]
actix-web = "4"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.0", features = ["full"] }`,
        "src/main.rs": `use actix_web::{web, App, HttpServer, Result};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct HelloResponse {
    message: String,
}

async fn hello() -> Result<web::Json<HelloResponse>> {
    Ok(web::Json(HelloResponse {
        message: "Hello from Actix-web!".to_string(),
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(hello))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}`
      }
    }
  }
};

export const getStructuresForLanguage = (language) => {
  return structureTemplates[language] || {};
};

export const getStructureChoices = (language) => {
  const structures = getStructuresForLanguage(language);
  return Object.entries(structures).map(([name, config]) => ({
    name: `${name} - ${config.description}`,
    value: config.id,
    config
  }));
};
