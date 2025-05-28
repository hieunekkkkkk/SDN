const { createLogger, format, transports } = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');
require('dotenv').config();

// Cấu hình client Elasticsearch
const esTransportOpts = {
    level: 'info',
    clientOpts: {
        node: `http://${process.env.ELASTICSEARCH_HOST || 'localhost'}:9200`,
    },
    indexPrefix: 'nodejs-app'
};

// Tạo transport cho Elasticsearch
const esTransport = new ElasticsearchTransport(esTransportOpts);

// Định dạng log
const logFormat = format.combine(
    format.timestamp(),
    format.json(),
    format.errors({ stack: true })
);

// Tạo logger
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'api-service' },
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        esTransport
    ]
});

// Xử lý khi không thể kết nối tới Elasticsearch
esTransport.on('error', (error) => {
    console.error('Error in Elasticsearch transport', error);
});


module.exports = logger;