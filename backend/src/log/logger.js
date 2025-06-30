const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
require('winston-logstash');
require('dotenv').config();

// Định dạng log cho Logstash
const logstashFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json(),
    format.printf(({ timestamp, level, message, service, stack, ...meta }) => {
        return JSON.stringify({
            '@timestamp': timestamp,
            level,
            message,
            service: service || 'api-service',
            type: 'nodejs',
            stack,
            ...meta
        });
    })
);

// Định dạng log cho console
const consoleFormat = format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, service, ...meta }) => {
        const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${service || 'api-service'}] ${level}: ${message} ${metaString}`;
    })
);

// Cấu hình transports
const loggerTransports = [
    // Console transport
    new transports.Console({
        format: consoleFormat,
        level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
    }),

    // Daily rotating file for errors
    new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        format: logstashFormat,
        maxSize: '20m',
        maxFiles: '14d'
    }),

    // Daily rotating file for all logs
    new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        format: logstashFormat,
        maxSize: '20m',
        maxFiles: '14d'
    })
];

// Thêm Logstash transport nếu có cấu hình
if (process.env.LOGSTASH_HOST) {
    loggerTransports.push(
        new transports.Logstash({
            port: parseInt(process.env.LOGSTASH_PORT) || 5044,
            node_name: 'backend-app',
            host: process.env.LOGSTASH_HOST || 'localhost',
            format: logstashFormat
        })
    );
}

// Tạo logger
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: {
        service: 'api-service',
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
    },
    transports: loggerTransports,
    exitOnError: false
});

// Xử lý lỗi
logger.on('error', (error) => {
    console.error('Logger error:', error);
});

// Helper functions
logger.logRequest = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress,
            requestId: req.id || 'unknown'
        };

        if (res.statusCode >= 400) {
            logger.error('HTTP Request Error', logData);
        } else {
            logger.info('HTTP Request', logData);
        }
    });

    next();
};

logger.logError = (error, context = {}) => {
    logger.error('Application Error', {
        error: error.message,
        stack: error.stack,
        context
    });
};

logger.logBusinessEvent = (event, data = {}) => {
    logger.info('Business Event', {
        event,
        ...data
    });
};


module.exports = logger;