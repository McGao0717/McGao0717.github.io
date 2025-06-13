"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ImageController_1 = __importDefault(require("../controllers/ImageController"));
const router = (0, express_1.Router)();
const imageController = new ImageController_1.default();
// OCR endpoint
router.post('/ocr', imageController.getUploadMiddleware(), (req, res) => imageController.extractText(req, res));
// Image moderation endpoint
router.post('/moderate', imageController.getUploadMiddleware(), (req, res) => imageController.moderateImage(req, res));
// Taobao image search endpoint
router.post('/search', (req, res) => imageController.searchProducts(req, res));
// Random image endpoint
router.get('/random', (req, res) => imageController.getRandomImage(req, res));
// Cleanup when the server shuts down
process.on('SIGTERM', async () => {
    await imageController.cleanup();
});
exports.default = router;
//# sourceMappingURL=imageRoutes.js.map