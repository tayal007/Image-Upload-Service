const commonMiddleware = require('../lib/commonMiddleware');
const createError = require('http-errors');
const uuid = require('uuid').v4;
const validator = require('@middy/validator');
const uploadPictureToS3 = require('../lib/uploadPictureToS3').uploadPictureToS3;
const setImageMetadata = require("../lib/setImageMetadata").setImageMetadata;
const removePictureFromS3 = require("../lib/uploadPictureToS3").removePictureFromS3;
const uploadImageSchema = require('../lib/schemas/uploadImageSchema');
const logger = require('../../logger');


const rollbackUpload = function (id, imageType) {
    return Promise.all([
        removePictureFromS3(id + '.' + imageType),
    ]).then(_ => {
        return Promise.reject(new createError["400"]('UPLOAD_FAILED'));
    });
};

const uploadImage = function (params) {
    const {
        imageDesc,
        imageData
    } = params;

    const imageType = imageData.substring("data:image/".length, imageData.indexOf(";base64"));
    logger.info('imageType:', imageType);
    if(imageType !== 'png' && imageType !== 'jpeg') {
        throw new createError.BadRequest('IMAGE_TYPE_ERROR');
    }

    // Calculate image size from base64 string
    // ref: https://stackoverflow.com/questions/29939635/how-to-get-file-size-of-newly-created-image-if-src-is-base64-string
    const imageSizeInKB = (4 * Math.ceil((imageData.length / 3)) * 0.5624896334383812 ) / 1000;
    logger.info('imageSizeInKB:', imageSizeInKB);
    if(imageSizeInKB > 500) {
        throw new createError.BadRequest('IMAGE_SIZE_ERROR');
    }
    const imageBase64 = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(imageBase64, 'base64');
    const id = uuid();
    try {
        return uploadPictureToS3(id + '.' + imageType, buffer, imageType)
            .then(imageUrl => {
                return setImageMetadata({id, imageDesc, imageType, imageSizeInKB})
                    .then(_ => {
                        return Promise.resolve({message: "Upload successful!"});
                    }).catch(err => {
                        logger.error(err.stack);
                        return rollbackUpload(id, imageType);
                    });
            }).catch(err => {
                logger.error(err.stack);
                return Promise.reject(err);
            });
    } catch (error) {
        throw new createError.InternalServerError(error);
    }
};

module.exports = commonMiddleware(uploadImage)
    .use(validator({inputSchema: uploadImageSchema}));