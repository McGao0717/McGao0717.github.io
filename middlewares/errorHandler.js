"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
const errorHandler = (logger) => {
    return (error, req, res, next) => {
        if (error instanceof ApiError) {
            logger.warn('API错误', {
                statusCode: error.statusCode,
                message: error.message,
                details: error.details,
                path: req.path
            });
            res.status(error.statusCode).json({
                error: {
                    message: error.message,
                    details: error.details
                }
            });
        }
        else {
            logger.error('未处理的错误', {
                error: error.message,
                stack: error.stack,
                path: req.path
            });
            res.status(500).json({
                error: {
                    message: '服务器内部错误',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                }
            });
        }
    };
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map