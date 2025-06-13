"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUtils = exports.errorLogger = exports.requestLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const api_types_1 = require("../types/api.types");
// 自定义日志格式
const customFormat = winston_1.default.format.printf(({ level, message, timestamp, ...metadata }) => {
    const metaStr = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaStr}`;
});
// 日志格式
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }), customFormat);
// 日志目录
const LOG_DIR = process.env.LOG_DIR || 'logs';
// 创建日志实例
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        }),
        new winston_1.default.transports.File({
            filename: 'error.log',
            level: 'error'
        }),
        new winston_1.default.transports.File({
            filename: 'combined.log'
        })
    ]
});
// 如果不是生产环境，打印到控制台
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
// 请求日志中间件
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const requestId = req.header('X-Request-ID') || Date.now().toString();
    // 记录请求开始
    exports.logger.info('请求开始', {
        requestId,
        method: req.method,
        url: req.originalUrl,
        query: req.query,
        body: req.body,
        headers: {
            'user-agent': req.get('user-agent'),
            'content-type': req.get('content-type'),
            'accept': req.get('accept')
        },
        ip: req.ip,
        clientId: req.header('X-Client-ID'),
        userId: req.header('X-User-ID')
    });
    // 响应结束时记录日志
    res.on('finish', () => {
        const duration = Date.now() - start;
        const level = res.statusCode >= 400 ? 'warn' : 'info';
        exports.logger.log(level, '请求结束', {
            requestId,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('content-length'),
            cacheHit: res.get('x-cache') === 'HIT',
            userAgent: req.get('user-agent'),
            ip: req.ip
        });
        // 记录慢请求
        if (duration > 1000) {
            exports.logger.warn('慢请求警告', {
                requestId,
                method: req.method,
                url: req.originalUrl,
                duration: `${duration}ms`
            });
        }
    });
    next();
};
exports.requestLogger = requestLogger;
// 错误日志记录
const errorLogger = (err, req, res, next) => {
    const requestId = req.header('X-Request-ID') || Date.now().toString();
    exports.logger.error('请求处理错误', {
        requestId,
        error: {
            name: err.name,
            message: err.message,
            code: err.code,
            status: err.status,
            stack: err.stack
        },
        request: {
            method: req.method,
            url: req.originalUrl,
            query: req.query,
            body: req.body,
            headers: req.headers,
            ip: req.ip,
            userId: req.header('X-User-ID')
        }
    });
    // 根据错误类型返回适当的错误码
    const statusCode = err.status || 500;
    const errorCode = err.code || api_types_1.ApiErrorCode.SYSTEM_ERROR;
    res.status(statusCode).json({
        code: errorCode,
        message: err.message || '系统错误',
        timestamp: Date.now(),
        requestId
    });
};
exports.errorLogger = errorLogger;
// 导出日志工具函数
exports.logUtils = {
    // 记录API调用
    logApiCall: (service, method, duration, success, metadata = {}) => {
        exports.logger.info(`API调用 - ${service}.${method}`, {
            ...metadata,
            duration,
            success
        });
    },
    // 记录缓存操作
    logCache: (operation, key, hit, metadata = {}) => {
        exports.logger.debug(`缓存操作 - ${operation}`, {
            ...metadata,
            key,
            hit
        });
    },
    // 记录业务事件
    logBusinessEvent: (event, metadata = {}) => {
        exports.logger.info(`业务事件 - ${event}`, metadata);
    },
    // 记录性能指标
    logPerformance: (metric, value, metadata = {}) => {
        exports.logger.info(`性能指标 - ${metric}`, {
            ...metadata,
            value
        });
    }
};
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map