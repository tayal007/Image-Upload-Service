const schema = {
    type: 'object',
    properties: {
        imageData: {
            type: 'string',
            minLength: 1,
            pattern: '\=$',
        },
        imageDesc: {
            type: 'string',
            minLength: 1,
        },
    },
    required: ['imageData', 'imageDesc'],
};

module.exports = schema;