exports.envConfig = {
    "dev": {
        logPath:'./logs/',
        logs: {
            transports: [
                {name: 'image-upload-service-error-file', level: 'error', filename: './logs/image-upload-service-error-logs.log'},
                {name: 'image-upload-service-info-file', level: 'info', filename: './logs/image-upload-service-info-logs.log'}
            ],
            console: true
        },
        // Bucket name for dev environment
        awsBucketName: '',
        // AWS mysql RDS details for dev environment
        mysqlDbConfig: {
            host: '',
            port: 3306,
            database: 'imagesmetadatadbdev',
            tableName: 'image_metadata',
        },
        awsCredProfile: 'image-upload-service-dev',
        awsCredFilePath: __dirname.replace(/config$/,'') + 'aws-credentials',
        accessLogs: {filename: './logs/image-upload-service-access-logs.log'},
        httpPort: 80
    },

    "prod": {
        logPath:'./logs/',
        logs: {
            transports: [
                {name: 'image-upload-service-error-file', level: 'error', filename: './logs/image-upload-service-error-logs.log'},
                {name: 'image-upload-service-info-file', level: 'info', filename: './logs/image-upload-service-info-logs.log'}
            ],
            console: true
        },
        // Bucket name for production setup
        awsBucketName: '',
        // AWS mysql RDS details for production
        mysqlDbConfig: {
            host: '',
            port: 3306,
            database: 'imagesmetadatadbprod',
            tableName: 'image_metadata',
        },
        awsCredProfile: 'image-upload-service-prod',
        awsCredFilePath: __dirname.replace(/config$/,'') + 'aws-credentials',
        accessLogs: {filename: './logs/image-upload-service-access-logs.log'},
        httpPort: 80
    },
};