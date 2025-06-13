"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const open_middleware_1 = require("./middleware/open.middleware");
const douyin_routes_1 = __importDefault(require("./routes/douyin.routes"));
const xiaohongshu_routes_1 = __importDefault(require("./routes/xiaohongshu.routes"));
const longvideo_routes_1 = __importDefault(require("./routes/longvideo.routes"));
const logger_1 = require("./utils/logger");
const WebController_1 = __importDefault(require("./controllers/WebController"));
const app = (0, express_1.default)();
// 基础中间件
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 开放访问和标准响应格式中间件
app.use(open_middleware_1.openAccess);
app.use(open_middleware_1.standardResponse);
// 请求日志记录
app.use((req, res, next) => {
    logger_1.logger.info('收到请求:', {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body,
        requestId: req.header('X-Request-ID') || Date.now().toString()
    });
    next();
});
// API路由
app.use('/api/douyin', douyin_routes_1.default);
app.use('/api/xiaohongshu', xiaohongshu_routes_1.default);
app.use('/api/longvideo', longvideo_routes_1.default);
app.use('/api/web', new WebController_1.default().router);
// 404处理
app.use((req, res) => {
    res.error('接口不存在', 404);
});
// 错误处理
app.use(open_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map