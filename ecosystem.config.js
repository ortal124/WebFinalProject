module.exports = {
    apps: [
      {
        name: "my-app",    // Name of the app
        script: "dist/src/app.js", // Path to the compiled JavaScript file
        interpreter: "node", // Use Node.js as the interpreter
        instances: "max",   // Number of instances (based on CPU cores)
        exec_mode: "cluster", // Run in cluster mode
        env: {
          NODE_ENV: "development", // Development mode
        },
        env_production: {
          NODE_ENV: "production", // Production mode
        },
      },
    ],
  };
  