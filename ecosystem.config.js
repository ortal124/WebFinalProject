module.exports = {
  apps : [{
    name   : "web_project",
    script : "./dist/app.js",
    env_production : {
      NODE_ENV: "production"
    }
  }]
}
