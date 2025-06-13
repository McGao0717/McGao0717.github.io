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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongVideo = exports.XiaohongshuVideo = exports.DouyinVideo = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// 基础视频Schema
const baseVideoSchema = new mongoose_1.Schema({
    platform: {
        type: String,
        enum: ['douyin', 'xiaohongshu', 'longvideo'],
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        index: true
    },
    description: String,
    url: {
        type: String,
        required: true
    },
    author: {
        id: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            required: true
        },
        avatar: String
    },
    stats: {
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        },
        shares: {
            type: Number,
            default: 0
        }
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
// 抖音视频Schema
const douyinVideoSchema = new mongoose_1.Schema({
    ...baseVideoSchema.obj,
    musicInfo: {
        id: String,
        title: String,
        author: String
    },
    challengeInfo: [{
            challengeId: String,
            challengeName: String
        }]
});
// 小红书视频Schema
const xiaohongshuVideoSchema = new mongoose_1.Schema({
    ...baseVideoSchema.obj,
    location: {
        name: String,
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    topics: [{
            id: String,
            name: String
        }]
});
// 长视频Schema
const longVideoSchema = new mongoose_1.Schema({
    ...baseVideoSchema.obj,
    duration: {
        type: Number,
        required: true
    },
    series: {
        id: String,
        name: String,
        episode: Number,
        totalEpisodes: Number
    },
    quality: {
        resolution: String,
        bitrate: Number
    },
    chapters: [{
            title: String,
            startTime: Number,
            endTime: Number
        }]
});
// 创建索引
baseVideoSchema.index({ title: 'text', description: 'text' });
baseVideoSchema.index({ 'author.nickname': 1 });
baseVideoSchema.index({ createdAt: -1 });
baseVideoSchema.index({ platform: 1 });
// 创建模型
exports.DouyinVideo = mongoose_1.default.model('DouyinVideo', douyinVideoSchema);
exports.XiaohongshuVideo = mongoose_1.default.model('XiaohongshuVideo', xiaohongshuVideoSchema);
exports.LongVideo = mongoose_1.default.model('LongVideo', longVideoSchema);
//# sourceMappingURL=VideoSchema.js.map