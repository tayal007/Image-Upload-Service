var config = require('./deployConfig').envConfig;
var env = process.env.NODE_ENV;

if(env == undefined){
    env = "dev"
}

console.log("env :" + env);
var projectEnv = config[env];

exports.projectEnv = projectEnv;
exports.env = env;