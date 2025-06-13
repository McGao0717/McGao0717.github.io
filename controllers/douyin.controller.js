"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DouyinController = void 0;
const douyin_service_1 = require("../services/douyin.service");
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
class DouyinController {
    constructor() {
        // Express route handlers
        this.getVideoDetail = async (req, res) => {
            try {
                const { id } = req.params;
                // Try to get from cache
                const cachedData = await redis_1.cacheUtils.get(`video:detail:${id}`);
                if (cachedData) {
                    res.json(cachedData);
                    return;
                }
                // Get from API
                const videoDetail = await this.fetchVideoDetails(id);
                // Save to cache
                await redis_1.cacheUtils.set(`video:detail:${id}`, videoDetail, 3600);
                res.json(videoDetail);
            }
            catch (error) {
                logger_1.logger.error('Error fetching video detail:', error);
                res.status(500).json({ error: 'Failed to fetch video detail' });
            }
        };
        this.getUserVideos = async (req, res) => {
            try {
                const { userId } = req.params;
                const { page = '1', pageSize = '20' } = req.query;
                const videos = await this.fetchUserVideos(userId, Number(page), Number(pageSize));
                res.json(videos);
            }
            catch (error) {
                logger_1.logger.error('Error fetching user videos:', error);
                res.status(500).json({ error: 'Failed to fetch user videos' });
            }
        };
        this.getTrendingVideos = async (req, res) => {
            try {
                const { category = 'all', limit = '50' } = req.query;
                const videos = await this.fetchTrendingVideos(category, Number(limit));
                res.json(videos);
            }
            catch (error) {
                logger_1.logger.error('Error fetching trending videos:', error);
                res.status(500).json({ error: 'Failed to fetch trending videos' });
            }
        };
        this.searchVideos = async (req, res) => {
            try {
                const { keyword, page = '1', pageSize = '20' } = req.query;
                if (!keyword) {
                    res.status(400).json({ error: 'Keyword is required' });
                    return;
                }
                const searchResults = await this.performVideoSearch(String(keyword), Number(page), Number(pageSize));
                res.json(searchResults);
            }
            catch (error) {
                logger_1.logger.error('Error searching videos:', error);
                res.status(500).json({ error: 'Failed to search videos' });
            }
        };
        this.service = new douyin_service_1.DouyinService();
    }
    // Internal service methods
    async fetchVideoDetails(videoId) {
        try {
            return await this.service.getVideoDetails(videoId);
        }
        catch (error) {
            logger_1.logger.error('Error fetching video details:', error);
            throw error;
        }
    }
    async fetchUserVideos(userId, page = 1, pageSize = 20) {
        try {
            return await this.service.getUserVideos(userId, page, pageSize);
        }
        catch (error) {
            logger_1.logger.error('Error fetching user videos:', error);
            throw error;
        }
    }
    async fetchTrendingVideos(category = 'all', limit = 50) {
        try {
            return await this.service.getTrendingVideos(category, limit);
        }
        catch (error) {
            logger_1.logger.error('Error fetching trending videos:', error);
            throw error;
        }
    }
    async performVideoSearch(keyword, page = 1, pageSize = 20) {
        try {
            return await this.service.searchVideos(keyword, page, pageSize);
        }
        catch (error) {
            logger_1.logger.error('Error performing video search:', error);
            throw error;
        }
    }
}
exports.DouyinController = DouyinController;
//# sourceMappingURL=douyin.controller.js.map