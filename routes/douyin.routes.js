"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const douyin_controller_1 = require("../controllers/douyin.controller");
const router = (0, express_1.Router)();
const controller = new douyin_controller_1.DouyinController();
// 获取视频详情
router.get('/videos/:id', async (req, res) => {
    try {
        const video = await controller.getVideoDetails(req.params.id);
        res.success(video);
    }
    catch (error) {
        res.error('获取视频详情失败');
    }
});
// 获取用户视频列表
router.get('/users/:id/videos', async (req, res) => {
    try {
        const { page = '1', pageSize = '20' } = req.query;
        const videos = await controller.getUserVideos(req.params.id, parseInt(page, 10), parseInt(pageSize, 10));
        res.success(videos);
    }
    catch (error) {
        res.error('获取用户视频列表失败');
    }
});
// 获取热门视频
router.get('/trending', async (req, res) => {
    try {
        const { category = 'all', limit = '50' } = req.query;
        const videos = await controller.getTrendingVideos(category, parseInt(limit, 10));
        res.success(videos);
    }
    catch (error) {
        res.error('获取热门视频失败');
    }
});
// 搜索视频
router.get('/search', async (req, res) => {
    try {
        const { keyword, page = '1', pageSize = '20' } = req.query;
        if (!keyword) {
            return res.error('搜索关键词不能为空');
        }
        const results = await controller.searchVideos(keyword, parseInt(page, 10), parseInt(pageSize, 10));
        res.success(results);
    }
    catch (error) {
        res.error('搜索视频失败');
    }
});
exports.default = router;
//# sourceMappingURL=douyin.routes.js.map