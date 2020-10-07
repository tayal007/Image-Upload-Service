const geDbConnection =  require('../persistence/dbConnection');
const projectEnv = require('../config/projectEnv').projectEnv;

const initMysqlDbAndTables = function () {
    return geDbConnection().then(mysqlClient => {
        return new Promise((resolve, reject) => {
            mysqlClient.query(
                'CREATE DATABASE IF NOT EXISTS ' + projectEnv.mysqlDbConfig.database + ';\n'+
                'use ' + projectEnv.mysqlDbConfig.database + ';\n' +
                'CREATE TABLE IF NOT EXISTS ' + projectEnv.mysqlDbConfig.tableName +
                '(uuid char(36) not null, ' +
                'description varchar(100) not null, ' +
                'file_type varchar(5) not null, ' +
                'size_in_kb decimal(5,2) not null, ' +
                'PRIMARY KEY (uuid));',
                function (error, results, fields) {
                    if (error) reject(error);
                    resolve(results);
                }
            );
        });
    });
};

module.exports = initMysqlDbAndTables;