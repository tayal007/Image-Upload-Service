const AWS = require('aws-sdk');
const projectEnv = require('../../config/projectEnv').projectEnv;
const logger = require('../../logger');

const credentials = new AWS.SharedIniFileCredentials(projectEnv.awsCredFilePath);
AWS.config.credentials = credentials;
const s3 = new AWS.S3();

const uploadPictureToS3 = function (key, body, imageType) {
    logger.info('upload image to s3 for: ', key);
    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: projectEnv.awsBucketName,
            Key: key,
            Body: body,
            ContentEncoding: 'base64',
            ContentType: 'image/' + imageType,
        }, function (err, result) {
            if (err) {
                reject(err);
            } else {
                logger.info('upload complete for image to s3 for: ', key);
                resolve(result.Location);
            }
        });
    });
}

const removePictureFromS3 = function (key) {
    logger.info('delete image from s3 for: ', key);
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: projectEnv.awsBucketName,
            Key: key,
        }, function (err, result) {
            if (err) {
                reject(err);
            } else {
                logger.info('delete successful for image from s3 for: ', key);
                resolve(result.DeleteMarker);
            }
        });
    });
};

exports.uploadPictureToS3 = uploadPictureToS3;
exports.removePictureFromS3 = removePictureFromS3;