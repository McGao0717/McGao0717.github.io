"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const MintroAIService_1 = __importDefault(require("../services/MintroAIService"));
const logger_1 = require("../utils/logger");
class VideoController {
    constructor() {
        this.processVideo = async (req, res) => {
            try {
                const videoData = req.file?.buffer;
                if (!videoData) {
                    res.status(400).json({ error: '没有提供视频数据' });
                    return;
                }
                const result = await this.aiService.processVideo(videoData);
                res.json(result);
            }
            catch (error) {
                logger_1.logger.error('Video processing failed:', error);
                res.status(500).json({ error: '视频处理失败' });
            }
        };
        this.aiService = new MintroAIService_1.default();
        this.router = (0, express_1.Router)();
        this.upload = (0, multer_1.default)({
            storage: multer_1.default.memoryStorage(),
            limits: {
                fileSize: 50 * 1024 * 1024 // 50MB
            }
        });
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.post('/process', this.upload.single('video'), this.processVideo);
    }
}
exports.VideoController = VideoController;
exports.default = new VideoController();
//# sourceMappingURL=VideoController.js.map