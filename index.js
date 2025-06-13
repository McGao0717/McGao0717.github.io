"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = exports.authMiddleware = exports.ApiError = exports.errorHandler = exports.WebController = exports.VideoController = exports.ImageController = exports.default = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const redis_1 = require("./config/redis");
const elasticsearch_1 = require("./config/elasticsearch");
const routes_1 = require("./routes");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const MintroAIService_1 = __importDefault(require("./services/MintroAIService"));
const ImageController_1 = __importDefault(require("./controllers/ImageController"));
exports.ImageController = ImageController_1.default;
const VideoController_1 = __importDefault(require("./controllers/VideoController"));
exports.VideoController = VideoController_1.default;
const WebController_1 = __importDefault(require("./controllers/WebController"));
exports.WebController = WebController_1.default;
const path_1 = __importDefault(require("path"));
// 加载环境变量
(0, dotenv_1.config)();
// 创建默认实例
const mintroAIService = new MintroAIService_1.default();
exports.default = mintroAIService;
// 导出中间件
var errorHandler_2 = require("./middlewares/errorHandler");
Object.defineProperty(exports, "errorHandler", { enumerable: true, get: function () { return errorHandler_2.errorHandler; } });
Object.defineProperty(exports, "ApiError", { enumerable: true, get: function () { return errorHandler_2.ApiError; } });
var auth_1 = require("./middlewares/auth");
Object.defineProperty(exports, "authMiddleware", { enumerable: true, get: function () { return auth_1.authMiddleware; } });
var logger_2 = require("./middlewares/logger");
Object.defineProperty(exports, "loggerMiddleware", { enumerable: true, get: function () { return logger_2.loggerMiddleware; } });
// 导出工具函数
__exportStar(require("./utils/file"), exports);
__exportStar(require("./utils/validation"), exports);
// 导出类型定义
__exportStar(require("./types"), exports);
// 导出配置
__exportStar(require("./config"), exports);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// 中间件
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 静态文件服务
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// 设置路由
(0, routes_1.setupRoutes)(app);
// 错误处理中间件
app.use(errorHandler_1.errorHandler);
// 连接数据库
async function connectDatabases() {
    try {
        // 连接MongoDB
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/video_platform');
        logger_1.logger.info('MongoDB connected successfully');
        // 测试Redis连接
        await redis_1.redisClient.ping();
        logger_1.logger.info('Redis connected successfully');
        // 测试Elasticsearch连接
        const esInfo = await elasticsearch_1.esClient.info();
        logger_1.logger.info(`Elasticsearch connected successfully: ${esInfo.version.number}`);
    }
    catch (error) {
        logger_1.logger.error('Database connection error:', error);
        process.exit(1);
    }
}
// 启动服务器
async function startServer() {
    try {
        await connectDatabases();
        app.listen(PORT, () => {
            logger_1.logger.info(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Server startup error:', error);
        process.exit(1);
    }
}
// 优雅关闭
process.on('SIGTERM', async () => {
    logger_1.logger.info('SIGTERM received. Shutting down gracefully...');
    try {
        await mongoose_1.default.disconnect();
        await redis_1.redisClient.quit();
        await elasticsearch_1.esClient.close();
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error('Error during graceful shutdown:', error);
        process.exit(1);
    }
});
startServer();
//# sourceMappingURL=index.js.map