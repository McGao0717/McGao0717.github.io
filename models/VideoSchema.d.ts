import mongoose, { Document } from 'mongoose';
interface BaseVideo extends Document {
    platform: 'douyin' | 'xiaohongshu' | 'longvideo';
    id: string;
    title: string;
    description?: string;
    url: string;
    author: {
        id: string;
        nickname: string;
        avatar?: string;
    };
    stats: {
        views: number;
        likes: number;
        comments: number;
        shares: number;
    };
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
interface DouyinVideoDoc extends BaseVideo {
    platform: 'douyin';
    musicInfo?: {
        id: string;
        title: string;
        author: string;
    };
    challengeInfo?: Array<{
        challengeId: string;
        challengeName: string;
    }>;
}
interface XiaohongshuVideoDoc extends BaseVideo {
    platform: 'xiaohongshu';
    location?: {
        name: string;
        coordinates: [number, number];
    };
    topics: Array<{
        id: string;
        name: string;
    }>;
}
interface LongVideoDoc extends BaseVideo {
    platform: 'longvideo';
    duration: number;
    series?: {
        id: string;
        name: string;
        episode: number;
        totalEpisodes: number;
    };
    quality: {
        resolution: string;
        bitrate: number;
    };
    chapters?: Array<{
        title: string;
        startTime: number;
        endTime: number;
    }>;
}
export declare const DouyinVideo: mongoose.Model<DouyinVideoDoc, {}, {}, {}, mongoose.Document<unknown, {}, DouyinVideoDoc, {}> & DouyinVideoDoc & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const XiaohongshuVideo: mongoose.Model<XiaohongshuVideoDoc, {}, {}, {}, mongoose.Document<unknown, {}, XiaohongshuVideoDoc, {}> & XiaohongshuVideoDoc & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const LongVideo: mongoose.Model<LongVideoDoc, {}, {}, {}, mongoose.Document<unknown, {}, LongVideoDoc, {}> & LongVideoDoc & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
