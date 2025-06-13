"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const axios_1 = __importDefault(require("axios"));
const tf = __importStar(require("@tensorflow/tfjs-node"));
const nsfw = __importStar(require("nsfwjs"));
const tesseract_js_1 = require("tesseract.js");
const sharp_1 = __importDefault(require("sharp"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../../utils/logger");
dotenv_1.default.config();
class ImageService {
    constructor() {
        this.nsfwModel = null;
        this.ocrWorker = null;
        this.initializeServices();
    }
    async initializeServices() {
        // Initialize NSFW detection model
        this.nsfwModel = await nsfw.load();
        // Initialize Tesseract OCR worker
        this.ocrWorker = await (0, tesseract_js_1.createWorker)('eng');
    }
    /**
     * OCR Service - Extract text from images
     */
    async extractTextFromImage(imageBuffer) {
        try {
            if (!this.ocrWorker) {
                throw new Error('OCR worker not initialized');
            }
            const { data: { text } } = await this.ocrWorker.recognize(imageBuffer);
            return text;
        }
        catch (error) {
            console.error('Error in OCR processing:', error);
            throw error;
        }
    }
    /**
     * Image Moderation Service
     */
    async moderateImage(imageBuffer) {
        try {
            if (!this.nsfwModel) {
                throw new Error('NSFW model not initialized');
            }
            const image = await tf.node.decodeImage(imageBuffer, 3);
            const predictions = await this.nsfwModel.classify(image);
            image.dispose();
            const categories = predictions.reduce((acc, pred) => {
                acc[pred.className] = pred.probability;
                return acc;
            }, {});
            const isNSFW = predictions.some(p => (p.className === 'Porn' || p.className === 'Hentai') &&
                p.probability > 0.7);
            return { isNSFW, categories };
        }
        catch (error) {
            console.error('Error in image moderation:', error);
            throw error;
        }
    }
    /**
     * Taobao Image Search Service
     */
    async searchSimilarProducts(imageUrl) {
        try {
            // 这里需要实现淘宝图片搜索API的具体调用
            // 由于需要商家身份认证，这里只提供示例代码
            const response = await axios_1.default.post('https://api.taobao.com/image_search', {
                image_url: imageUrl,
                app_key: process.env.TAOBAO_APP_KEY,
                app_secret: process.env.TAOBAO_APP_SECRET
            });
            return response.data;
        }
        catch (error) {
            console.error('Error in Taobao image search:', error);
            throw error;
        }
    }
    /**
     * Random Image Service
     */
    async getRandomImage(category) {
        try {
            logger_1.logger.info(`Getting random ${category} image...`);
            let apiUrl;
            let headers = {};
            if (category === 'anime') {
                apiUrl = process.env.RANDOM_ANIME_API || 'https://api.waifu.pics/sfw/waifu';
            }
            else {
                apiUrl = process.env.RANDOM_LANDSCAPE_API || 'https://api.unsplash.com/photos/random?query=landscape';
                headers = {
                    'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                };
            }
            const response = await axios_1.default.get(apiUrl, { headers });
            return category === 'anime' ? response.data.url : response.data.urls.regular;
        }
        catch (error) {
            logger_1.logger.error('Failed to get random image:', error);
            throw error;
        }
    }
    /**
     * Image Processing Utilities
     */
    async preprocessImage(imageBuffer) {
        try {
            logger_1.logger.info('Preprocessing image...');
            return await (0, sharp_1.default)(imageBuffer)
                .resize(800, 800, { fit: 'inside' })
                .normalize()
                .sharpen()
                .toBuffer();
        }
        catch (error) {
            logger_1.logger.error('Image preprocessing failed:', error);
            throw error;
        }
    }
    async cleanup() {
        try {
            logger_1.logger.info('Cleaning up ImageService resources...');
            if (this.ocrWorker) {
                await this.ocrWorker.terminate();
            }
            if (this.nsfwModel) {
                // Cleanup TensorFlow memory
                tf.dispose();
            }
        }
        catch (error) {
            logger_1.logger.error('Cleanup failed:', error);
            throw error;
        }
    }
}
exports.ImageService = ImageService;
//# sourceMappingURL=ImageService.js.map