"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const xiaohongshu_controller_1 = require("../controllers/xiaohongshu.controller");
const router = (0, express_1.Router)();
const controller = new xiaohongshu_controller_1.XiaohongshuController();
// 获取视频详情
router.get('/video/:id', controller.getVideoDetail);
// 获取用户视频列表
router.get('/user/:userId/videos', controller.getUserVideos);
// 获取热门视频
router.get('/trending', controller.getTrendingVideos);
// 搜索视频
router.get('/search', controller.searchVideos);
// 获取视频评论
router.get('/video/:id/comments', controller.getVideoComments);
// 获取视频统计数据
router.get('/video/:id/stats', controller.getVideoStats);
exports.default = router;
//# sourceMappingURL=xiaohongshu.routes.js.map