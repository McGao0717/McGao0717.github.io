"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleApiError = exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
// 自定义错误类
class AppError extends Error {
    constructor(statusCode, message, source, raw) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.source = source;
        this.raw = raw;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
// 错误处理中间件
const errorHandler = (error, req, res, next) => {
    const appError = (0, exports.handleApiError)(error);
    // 记录错误日志
    logger_1.logger.error('Error occurred:', {
        statusCode: appError.statusCode,
        message: appError.message,
        source: appError.source,
        path: req.path,
        method: req.method,
        raw: appError.raw
    });
    // 发送错误响应
    res.status(appError.statusCode).json({
        status: 'error',
        message: appError.message,
        ...(process.env.NODE_ENV === 'development' && {
            source: appError.source,
            stack: appError.stack
        })
    });
};
exports.errorHandler = errorHandler;
// API错误响应处理
const handleApiError = (error) => {
    if (error instanceof AppError) {
        return error;
    }
    // API错误
    if (error.response) {
        return new AppError(error.response.status, error.response.data?.message || 'API调用失败', 'external_api', error.response.data);
    }
    // 网络错误
    if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        return new AppError(503, '服务暂时不可用', 'network', error);
    }
    // 默认错误
    return new AppError(500, '服务器内部错误', 'internal', error);
};
exports.handleApiError = handleApiError;
//# sourceMappingURL=errorHandler.js.map