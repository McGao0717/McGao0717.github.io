"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
const responseHandler = (req, res, next) => {
    // 扩展 response 对象
    res.success = function (data, message) {
        const response = {
            status: 'success',
            data,
            message
        };
        return this.json(response);
    };
    res.error = function (message, statusCode = 500) {
        const response = {
            status: 'error',
            message
        };
        return this.status(statusCode).json(response);
    };
    next();
};
exports.responseHandler = responseHandler;
//# sourceMappingURL=responseHandler.js.map