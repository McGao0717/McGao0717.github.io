"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mysql_service_1 = require("../services/mysql.service");
const logger_1 = require("../utils/logger");
class MySQLTestController {
    constructor() {
        this.updateVideoStats = async (req, res) => {
            try {
                const stats = req.body;
                await this.mysqlService.updateVideoStats(stats);
                res.json({ success: true });
            }
            catch (error) {
                logger_1.logger.error('Error in updateVideoStats:', error);
                res.status(500).json({ error: 'Failed to update video stats' });
            }
        };
        this.getVideoStats = async (req, res) => {
            try {
                const { videoId } = req.params;
                const stats = await this.mysqlService.getVideoStats(videoId);
                res.json(stats);
            }
            catch (error) {
                logger_1.logger.error('Error in getVideoStats:', error);
                res.status(500).json({ error: 'Failed to get video stats' });
            }
        };
        this.recordInteraction = async (req, res) => {
            try {
                const interaction = req.body;
                await this.mysqlService.recordInteraction(interaction);
                res.json({ success: true });
            }
            catch (error) {
                logger_1.logger.error('Error in recordInteraction:', error);
                res.status(500).json({ error: 'Failed to record interaction' });
            }
        };
        this.getUserInteractions = async (req, res) => {
            try {
                const { userId } = req.params;
                const { limit } = req.query;
                const interactions = await this.mysqlService.getUserInteractions(parseInt(userId), limit ? parseInt(limit) : undefined);
                res.json(interactions);
            }
            catch (error) {
                logger_1.logger.error('Error in getUserInteractions:', error);
                res.status(500).json({ error: 'Failed to get user interactions' });
            }
        };
        this.addComment = async (req, res) => {
            try {
                const comment = req.body;
                const commentId = await this.mysqlService.addComment(comment);
                res.json({ success: true, commentId });
            }
            catch (error) {
                logger_1.logger.error('Error in addComment:', error);
                res.status(500).json({ error: 'Failed to add comment' });
            }
        };
        this.getVideoComments = async (req, res) => {
            try {
                const { videoId } = req.params;
                const { page, pageSize } = req.query;
                const comments = await this.mysqlService.getVideoComments(videoId, page ? parseInt(page) : undefined, pageSize ? parseInt(pageSize) : undefined);
                res.json(comments);
            }
            catch (error) {
                logger_1.logger.error('Error in getVideoComments:', error);
                res.status(500).json({ error: 'Failed to get video comments' });
            }
        };
        this.addVideoTags = async (req, res) => {
            try {
                const { videoId, tags } = req.body;
                await this.mysqlService.addVideoTags(videoId, tags);
                res.json({ success: true });
            }
            catch (error) {
                logger_1.logger.error('Error in addVideoTags:', error);
                res.status(500).json({ error: 'Failed to add video tags' });
            }
        };
        this.getVideoTags = async (req, res) => {
            try {
                const { videoId } = req.params;
                const tags = await this.mysqlService.getVideoTags(videoId);
                res.json(tags);
            }
            catch (error) {
                logger_1.logger.error('Error in getVideoTags:', error);
                res.status(500).json({ error: 'Failed to get video tags' });
            }
        };
        // 从环境变量或配置文件获取数据库配置
        const config = {
            host: process.env.MYSQL_HOST || 'localhost',
            port: parseInt(process.env.MYSQL_PORT || '3306'),
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'root',
            database: process.env.MYSQL_DATABASE || 'mintro_ai',
            connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT || '10')
        };
        this.mysqlService = new mysql_service_1.MySQLService(config);
        this.router = (0, express_1.Router)();
        this.setupRoutes();
    }
    setupRoutes() {
        // 视频统计相关路由
        this.router.post('/video-stats', this.updateVideoStats);
        this.router.get('/video-stats/:videoId', this.getVideoStats);
        // 视频互动相关路由
        this.router.post('/interaction', this.recordInteraction);
        this.router.get('/user-interactions/:userId', this.getUserInteractions);
        // 视频评论相关路由
        this.router.post('/comment', this.addComment);
        this.router.get('/video-comments/:videoId', this.getVideoComments);
        // 视频标签相关路由
        this.router.post('/video-tags', this.addVideoTags);
        this.router.get('/video-tags/:videoId', this.getVideoTags);
    }
}
// 导出单例实例
exports.default = new MySQLTestController();
//# sourceMappingURL=MySQLTestController.js.map