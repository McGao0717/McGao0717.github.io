"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaohongshuController = void 0;
const xiaohongshu_service_1 = require("../services/xiaohongshu.service");
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("../middleware/errorHandler");
class XiaohongshuController {
    constructor() {
        // 获取视频详情
        this.getVideoDetail = async (req, res) => {
            try {
                const { id } = req.params;
                // 尝试从缓存获取
                const cachedData = await redis_1.cacheUtils.get(`xiaohongshu:video:${id}`);
                if (cachedData) {
                    res.json(cachedData);
                    return;
                }
                const videoDetail = await this.service.getVideoDetail(id);
                // 存入缓存
                await redis_1.cacheUtils.set(`xiaohongshu:video:${id}`, videoDetail, 3600);
                res.json(videoDetail);
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in getVideoDetail:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        // 获取用户视频列表
        this.getUserVideos = async (req, res) => {
            try {
                const { userId } = req.params;
                const { page = '1', pageSize = '20' } = req.query;
                const videos = await this.service.getUserVideos(userId, Number(page), Number(pageSize));
                res.json(videos);
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in getUserVideos:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        // 获取热门视频
        this.getTrendingVideos = async (req, res) => {
            try {
                const { category, limit = '20' } = req.query;
                const videos = await this.service.getTrendingVideos(String(category), Number(limit));
                res.json(videos);
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in getTrendingVideos:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        // 搜索视频
        this.searchVideos = async (req, res) => {
            try {
                const { keyword, page = '1', pageSize = '20', sort = 'relevance' } = req.query;
                if (!keyword) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Keyword is required'
                    });
                    return;
                }
                const searchResults = await this.service.searchVideos(String(keyword), Number(page), Number(pageSize), String(sort));
                res.json(searchResults);
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in searchVideos:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        // 获取视频评论
        this.getVideoComments = async (req, res) => {
            try {
                const { id } = req.params;
                const { page = '1', pageSize = '20' } = req.query;
                const comments = await this.service.getVideoComments(id, Number(page), Number(pageSize));
                res.json(comments);
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in getVideoComments:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        // 获取视频统计数据
        this.getVideoStats = async (req, res) => {
            try {
                const { id } = req.params;
                // 尝试从缓存获取
                const cachedStats = await redis_1.cacheUtils.get(`xiaohongshu:stats:${id}`);
                if (cachedStats) {
                    res.json(cachedStats);
                    return;
                }
                const stats = await this.service.getVideoStats(id);
                // 存入缓存（较短的过期时间，因为统计数据经常变化）
                await redis_1.cacheUtils.set(`xiaohongshu:stats:${id}`, stats, 300);
                res.json(stats);
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in getVideoStats:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        this.service = new xiaohongshu_service_1.XiaohongshuService();
    }
}
exports.XiaohongshuController = XiaohongshuController;
//# sourceMappingURL=xiaohongshu.controller.js.map