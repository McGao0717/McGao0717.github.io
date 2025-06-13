"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIService = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
class APIService {
    constructor(config) {
        this.config = {
            ...config,
            baseURL: config.baseURL || 'https://api.mintro.ai'
        };
        this.client = axios_1.default.create({
            baseURL: this.config.baseURL,
            timeout: 30000
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.client.interceptors.request.use((config) => {
            const headers = this.getAuthHeaders();
            if (config.headers) {
                config.headers['X-API-Key'] = headers['X-API-Key'];
                config.headers['X-Access-Token'] = headers['X-Access-Token'];
                config.headers['X-Timestamp'] = headers['X-Timestamp'];
                config.headers['X-Signature'] = headers['X-Signature'];
            }
            return config;
        });
        this.client.interceptors.response.use(response => response, error => {
            if (error.response) {
                throw new Error(error.response.data.error || '请求失败');
            }
            throw new Error('网络错误');
        });
    }
    getAuthHeaders() {
        const timestamp = Date.now().toString();
        const signString = `${this.config.apiKey}${this.config.apiSecret}${timestamp}`;
        const signature = crypto_1.default.createHash('md5').update(signString).digest('hex');
        return {
            'X-API-Key': this.config.apiKey,
            'X-Access-Token': this.config.accessToken,
            'X-Timestamp': timestamp,
            'X-Signature': signature
        };
    }
    async ocrImage(imagePath) {
        const form = new form_data_1.default();
        form.append('image', fs_1.default.createReadStream(imagePath));
        const response = await this.client.post('/ocr/text', form, {
            headers: form.getHeaders()
        });
        return response.data;
    }
    async moderateImage(imagePath) {
        const form = new form_data_1.default();
        form.append('image', fs_1.default.createReadStream(imagePath));
        const response = await this.client.post('/image/moderate', form, {
            headers: form.getHeaders()
        });
        return response.data;
    }
    async getDouyinVideoInfo(videoId) {
        const response = await this.client.get('/douyin/video/info', {
            params: { video_id: videoId }
        });
        return response.data;
    }
    async getXiaohongshuInfo(noteId) {
        const response = await this.client.get('/xiaohongshu/note/info', {
            params: { note_id: noteId }
        });
        return response.data;
    }
}
exports.APIService = APIService;
//# sourceMappingURL=APIService.js.map