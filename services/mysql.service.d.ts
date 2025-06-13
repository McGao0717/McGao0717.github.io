export interface MySQLConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
}
export interface VideoStats {
    video_id: string;
    platform: 'douyin' | 'xiaohongshu' | 'longvideo';
    views: number;
    likes: number;
    comments: number;
    shares: number;
}
export interface VideoInteraction {
    user_id: number;
    video_id: string;
    interaction_type: 'view' | 'like' | 'comment' | 'share';
}
export interface VideoComment {
    video_id: string;
    user_id: number;
    content: string;
    parent_id?: number;
}
export interface VideoTag {
    video_id: string;
    tag_name: string;
}
export declare class MySQLService {
    private pool;
    constructor(config: MySQLConfig);
    query<T>(sql: string, values?: any[]): Promise<T[]>;
    cleanup(): Promise<void>;
    updateVideoStats(stats: VideoStats): Promise<void>;
    getVideoStats(videoId: string): Promise<VideoStats | null>;
    recordInteraction(interaction: VideoInteraction): Promise<void>;
    getUserInteractions(userId: number, limit?: number): Promise<VideoInteraction[]>;
    addComment(comment: VideoComment): Promise<number>;
    getVideoComments(videoId: string, page?: number, pageSize?: number): Promise<VideoComment[]>;
    addVideoTags(videoId: string, tags: string[]): Promise<void>;
    getVideoTags(videoId: string): Promise<string[]>;
}
