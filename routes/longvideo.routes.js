"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const longvideo_controller_1 = require("../controllers/longvideo.controller");
const router = (0, express_1.Router)();
const controller = new longvideo_controller_1.LongVideoController();
// 获取视频详情
router.get('/video/:id', controller.getVideoDetail);
// 获取专辑信息
router.get('/album/:id', controller.getAlbumInfo);
// 获取专辑下的视频列表
router.get('/album/:id/videos', controller.getAlbumVideos);
// 获取视频播放信息
router.get('/video/:id/playinfo', controller.getVideoPlayInfo);
// 获取视频章节信息
router.get('/video/:id/chapters', controller.getVideoChapters);
// 推送媒资信息
router.post('/push', controller.pushMediaInfo);
// 批量推送媒资信息
router.post('/push/batch', controller.pushMediaInfoBatch);
exports.default = router;
//# sourceMappingURL=longvideo.routes.js.map