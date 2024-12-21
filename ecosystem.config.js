module.exports = {
    apps: [
      {
        name: "web-final",
        script: "dist/src/app.js",
        interpreter: "node",
        instances: "max",
        exec_mode: "cluster",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  