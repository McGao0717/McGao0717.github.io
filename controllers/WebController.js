"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebController = void 0;
const express_1 = require("express");
const logger_1 = require("../utils/logger");
const MintroAIService_1 = require("../services/MintroAIService");
class WebController {
    constructor(aiService) {
        this.getStatus = async (req, res) => {
            try {
                res.success({ status: 'running' });
            }
            catch (error) {
                logger_1.logger.error('Status check failed:', error);
                res.error('Service unavailable');
            }
        };
        this.processWebPage = async (req, res) => {
            try {
                const { url, options } = req.body;
                if (!url) {
                    res.error('No URL provided', 400);
                    return;
                }
                const result = await this.aiService.processWebPage(url, options);
                res.success(result, 'Web page processed successfully');
            }
            catch (error) {
                logger_1.logger.error('Web page processing failed:', error);
                res.error('Failed to process web page');
            }
        };
        this.router = (0, express_1.Router)();
        this.aiService = aiService || new MintroAIService_1.MintroAIService();
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.get('/status', this.getStatus);
        this.router.post('/process', this.processWebPage);
    }
}
exports.WebController = WebController;
//# sourceMappingURL=WebController.js.map