"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongVideoController = void 0;
const longvideo_service_1 = require("../services/longvideo.service");
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("../middleware/errorHandler");
class LongVideoController {
    constructor() {
        // 获取视频详情
        this.getVideoDetail = async (req, res) => {
            try {
                const { id } = req.params;
                // 尝试从缓存获取
                const cachedData = await redis_1.cacheUtils.get(`longvideo:${id}`);
                if (cachedData) {
                    res.json(cachedData);
                    return;
                }
                const videoDetail = await this.service.getVideoDetail(id);
                // 存入缓存
                await redis_1.cacheUtils.set(`longvideo:${id}`, videoDetail, 3600);
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
        // 获取专辑信息
        this.getAlbumInfo = async (req, res) => {
            try {
                const { id } = req.params;
                const albumInfo = await this.service.getAlbumInfo(id);
                res.json(albumInfo);
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in getAlbumInfo:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        // 获取专辑下的视频列表
        this.getAlbumVideos = async (req, res) => {
            try {
                const { id } = req.params;
                const { page = '1', pageSize = '20' } = req.query;
                const videos = await this.service.getAlbumVideos(id, Number(page), Number(pageSize));
                res.json(videos);
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in getAlbumVideos:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        // 获取视频播放信息
        this.getVideoPlayInfo = async (req, res) => {
            try {
                const { id } = req.params;
                const { quality } = req.query;
                const playInfo = await this.service.getVideoPlayInfo(id, String(quality));
                res.json(playInfo);
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in getVideoPlayInfo:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        // 获取视频章节信息
        this.getVideoChapters = async (req, res) => {
            try {
                const { id } = req.params;
                const chapters = await this.service.getVideoChapters(id);
                res.json(chapters);
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in getVideoChapters:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        // 推送媒资信息
        this.pushMediaInfo = async (req, res) => {
            try {
                const mediaInfo = req.body;
                await this.service.pushMediaInfo(mediaInfo);
                res.json({
                    status: 'success',
                    message: 'Media info pushed successfully'
                });
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in pushMediaInfo:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        // 批量推送媒资信息
        this.pushMediaInfoBatch = async (req, res) => {
            try {
                const { mediaInfoList } = req.body;
                if (!Array.isArray(mediaInfoList)) {
                    res.status(400).json({
                        status: 'error',
                        message: 'mediaInfoList must be an array'
                    });
                    return;
                }
                await this.service.pushMediaInfoBatch(mediaInfoList);
                res.json({
                    status: 'success',
                    message: 'Media info batch pushed successfully'
                });
            }
            catch (error) {
                const appError = (0, errorHandler_1.handleApiError)(error);
                logger_1.logger.error('Error in pushMediaInfoBatch:', error);
                res.status(appError.statusCode).json({
                    status: 'error',
                    message: appError.message
                });
            }
        };
        this.service = new longvideo_service_1.LongVideoService();
    }
}
exports.LongVideoController = LongVideoController;
//# sourceMappingURL=longvideo.controller.js.map