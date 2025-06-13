"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const logger_1 = require("../utils/logger");
const file_1 = require("../utils/file");
const MintroAIService_1 = require("../services/MintroAIService");
class ImageController {
    constructor(aiService) {
        this.uploadImage = async (req, res) => {
            try {
                if (!req.file) {
                    res.error('No image file provided', 400);
                    return;
                }
                const fileInfo = {
                    filename: req.file.originalname,
                    size: req.file.size,
                    mimetype: req.file.mimetype
                };
                res.success(fileInfo, 'Image uploaded successfully');
            }
            catch (error) {
                logger_1.logger.error('Image upload failed:', error);
                res.error('Failed to upload image');
            }
        };
        this.analyzeImage = async (req, res) => {
            try {
                if (!req.file) {
                    res.error('No image file provided', 400);
                    return;
                }
                const result = await this.aiService.analyzeImage(req.file.buffer);
                res.success(result, 'Image analyzed successfully');
            }
            catch (error) {
                logger_1.logger.error('Image analysis failed:', error);
                res.error('Failed to analyze image');
            }
        };
        this.processImage = async (req, res) => {
            try {
                if (!req.file) {
                    res.error('No image file provided', 400);
                    return;
                }
                const result = await this.aiService.processImage(req.file.buffer);
                res.success(result, 'Image processed successfully');
            }
            catch (error) {
                logger_1.logger.error('Image processing failed:', error);
                res.error('Failed to process image');
            }
        };
        this.searchProducts = async (req, res) => {
            try {
                const { imageUrl } = req.body;
                if (!imageUrl) {
                    res.error('No image URL provided', 400);
                    return;
                }
                const result = await this.aiService.searchSimilarProducts(imageUrl);
                res.success(result, 'Similar products found');
            }
            catch (error) {
                logger_1.logger.error('Product search failed:', error);
                res.error('Failed to search products');
            }
        };
        this.getImageInfo = async (req, res) => {
            try {
                const { filename } = req.params;
                if (!(0, file_1.isImageFile)(filename)) {
                    res.error('Invalid image file', 400);
                    return;
                }
                const imageInfo = {
                    filename,
                    isValid: true
                };
                res.success(imageInfo);
            }
            catch (error) {
                logger_1.logger.error('Failed to get image info:', error);
                res.error('Failed to get image information');
            }
        };
        this.router = (0, express_1.Router)();
        this.aiService = aiService || new MintroAIService_1.MintroAIService();
        this.upload = (0, multer_1.default)({
            storage: multer_1.default.memoryStorage(),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.startsWith('image/')) {
                    cb(new Error('Only image files are allowed'));
                    return;
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024 // 5MB
            }
        });
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.post('/upload', this.upload.single('image'), this.uploadImage);
        this.router.post('/analyze', this.upload.single('image'), this.analyzeImage);
        this.router.post('/process', this.upload.single('image'), this.processImage);
        this.router.post('/search', this.searchProducts);
        this.router.get('/info/:filename', this.getImageInfo);
    }
}
exports.ImageController = ImageController;
//# sourceMappingURL=ImageController.js.map