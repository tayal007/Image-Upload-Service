const fs = require('fs');
const ini = require('ini');
const mysql = require('mysql');
const projectEnv = require('../config/projectEnv').projectEnv;
let connection = null;
const logger = require('../logger');

const getRDSCredentials = function(profile) {
    const config = ini.parse(fs.readFileSync(projectEnv.awsCredFilePath, 'utf-8'));
    try {
        return Promise.resolve({user: config[profile].rds_image_db_user, password: config[profile].rds_image_db_password });
    } catch (ex) {
        return Promise.reject(ex);
    }
}

const getDbConnection =  function () {
    if(!connection) {
        return getRDSCredentials(projectEnv.awsCredProfile).then(credentials => {
            connection = mysql.createConnection({
                host: projectEnv.mysqlDbConfig.host,
                port: projectEnv.mysqlDbConfig.port,
                user: credentials.user,
                password:credentials.password,
                multipleStatements: true
            });
            return new Promise((resolve, reject) => {
                connection.connect(function(err) {
                    if (err) {
                        logger.error(err.stack);
                        connection = null;
                    }
                    resolve(connection);
                });
            });
        });
    }
    return Promise.resolve(connection);
};

module.exports = getDbConnection;