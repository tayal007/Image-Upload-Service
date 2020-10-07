const geDbConnection =  require('../../persistence/dbConnection');
const projectEnv = require('../../config/projectEnv').projectEnv;
const logger = require('../../logger');

const setImageMetadata = function (params) {
    const {
        id,
        imageDesc,
        imageType,
        imageSizeInKB
    } = params;

    logger.info('Setting image metadata for: ', id);
    return geDbConnection()
        .then(mysqlClient => {
            try {
                return new Promise((resolve, reject) => {
                    mysqlClient.query(
                        'use ' + projectEnv.mysqlDbConfig.database+ ';\n' +
                        'INSERT INTO ' + projectEnv.mysqlDbConfig.tableName + ' (uuid, description, file_type, size_in_kb) VALUES(?,?,?,?)',
                        [id, imageDesc, imageType, imageSizeInKB],
                        function (error, results, fields) {
                            if (error) reject(error);
                            logger.info('Set successful for image metadata : ', id);
                            resolve(results);
                        }
                    );
                });
            } catch(err) {
                return Promise.reject(err);
            }
        });
}

exports.setImageMetadata = setImageMetadata;