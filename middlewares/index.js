"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.authMiddleware = exports.loggerMiddleware = void 0;
const winston_1 = __importDefault(require("winston"));
// 创建日志记录器
const logger = winston_1.default.createLogger({
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
// 日志中间件
const loggerMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`
        });
    });
    next();
};
exports.loggerMiddleware = loggerMiddleware;
// 认证中间件
const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    if (!apiKey || apiKey !== process.env.MINTRO_API_KEY) {
        return res.status(401).json({ error: '未授权访问' });
    }
    next();
};
exports.authMiddleware = authMiddleware;
// 错误处理中间件
const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? '服务器内部错误'
            : err.message
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=index.js.map