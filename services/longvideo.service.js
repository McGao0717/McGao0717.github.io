"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongVideoService = void 0;
const axios_1 = __importDefault(require("axios"));
const VideoSchema_1 = require("../models/VideoSchema");
const logger_1 = require("../utils/logger");
const elasticsearch_1 = require("../config/elasticsearch");
class LongVideoService {
    constructor() {
        this.baseUrl = process.env.LONGVIDEO_API_URL || 'http://api.longvideo.com/v1';
        this.apiKey = process.env.LONGVIDEO_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('Long video API key is not configured');
        }
    }
    // 获取视频详情
    async getVideoDetail(videoId) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/videos/${videoId}`, {
                headers: this.getHeaders()
            });
            if (response.data.code !== 0) {
                throw new Error(response.data.message);
            }
            // 保存到MongoDB
            await VideoSchema_1.LongVideo.findOneAndUpdate({ id: videoId }, {
                platform: 'longvideo',
                ...response.data.data,
                updatedAt: new Date()
            }, { upsert: true });
            return response.data.data;
        }
        catch (error) {
            logger_1.logger.error('Error in getVideoDetail:', error);
            throw error;
        }
    }
    // 获取专辑信息
    async getAlbumInfo(albumId) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/albums/${albumId}`, {
                headers: this.getHeaders()
            });
            if (response.data.code !== 0) {
                throw new Error(response.data.message);
            }
            return response.data.data;
        }
        catch (error) {
            logger_1.logger.error('Error in getAlbumInfo:', error);
            throw error;
        }
    }
    // 获取专辑下的视频列表
    async getAlbumVideos(albumId, page, pageSize) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/albums/${albumId}/videos`, {
                params: {
                    page,
                    page_size: pageSize
                },
                headers: this.getHeaders()
            });
            if (response.data.code !== 0) {
                throw new Error(response.data.message);
            }
            return response.data.data;
        }
        catch (error) {
            logger_1.logger.error('Error in getAlbumVideos:', error);
            throw error;
        }
    }
    // 获取视频播放信息
    async getVideoPlayInfo(videoId, quality) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/videos/${videoId}/play_info`, {
                params: { quality },
                headers: this.getHeaders()
            });
            if (response.data.code !== 0) {
                throw new Error(response.data.message);
            }
            return response.data.data;
        }
        catch (error) {
            logger_1.logger.error('Error in getVideoPlayInfo:', error);
            throw error;
        }
    }
    // 获取视频章节信息
    async getVideoChapters(videoId) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/videos/${videoId}/chapters`, {
                headers: this.getHeaders()
            });
            if (response.data.code !== 0) {
                throw new Error(response.data.message);
            }
            return response.data.data;
        }
        catch (error) {
            logger_1.logger.error('Error in getVideoChapters:', error);
            throw error;
        }
    }
    // 推送媒资信息
    async pushMediaInfo(mediaInfo) {
        try {
            // 保存到MongoDB
            const video = new VideoSchema_1.LongVideo({
                platform: 'longvideo',
                ...mediaInfo,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await video.save();
            // 索引到Elasticsearch
            await elasticsearch_1.esClient.index({
                index: 'videos',
                document: {
                    ...mediaInfo,
                    platform: 'longvideo',
                    timestamp: new Date()
                }
            });
            logger_1.logger.info('Media info pushed successfully:', { id: mediaInfo.id });
        }
        catch (error) {
            logger_1.logger.error('Error in pushMediaInfo:', error);
            throw error;
        }
    }
    // 批量推送媒资信息
    async pushMediaInfoBatch(mediaInfoList) {
        try {
            // 批量保存到MongoDB
            const videos = mediaInfoList.map(info => ({
                platform: 'longvideo',
                ...info,
                createdAt: new Date(),
                updatedAt: new Date()
            }));
            await VideoSchema_1.LongVideo.insertMany(videos);
            // 批量索引到Elasticsearch
            const body = mediaInfoList.flatMap(info => [
                { index: { _index: 'videos' } },
                {
                    ...info,
                    platform: 'longvideo',
                    timestamp: new Date()
                }
            ]);
            await elasticsearch_1.esClient.bulk({ body });
            logger_1.logger.info('Media info batch pushed successfully', {
                count: mediaInfoList.length
            });
        }
        catch (error) {
            logger_1.logger.error('Error in pushMediaInfoBatch:', error);
            throw error;
        }
    }
    // 生成请求头
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-Key': this.apiKey
        };
    }
}
exports.LongVideoService = LongVideoService;
//# sourceMappingURL=longvideo.service.js.map