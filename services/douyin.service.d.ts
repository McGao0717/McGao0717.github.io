import { PaginationData } from '../types/api.types';
interface VideoDetails {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    playUrl: string;
    duration: number;
    width: number;
    height: number;
    author: {
        id: string;
        nickname: string;
        avatarUrl: string;
    };
    stats: {
        views: number;
        likes: number;
        comments: number;
        shares: number;
    };
    createTime: number;
}
interface SearchResult extends PaginationData<VideoDetails> {
}
export declare class DouyinService {
    private baseUrl;
    private apiKey;
    constructor();
    getVideoDetails(videoId: string): Promise<VideoDetails>;
    getUserVideos(userId: string, page?: number, pageSize?: number): Promise<PaginationData<VideoDetails>>;
    getTrendingVideos(category?: string, limit?: number): Promise<VideoDetails[]>;
    searchVideos(keyword: string, page?: number, pageSize?: number): Promise<SearchResult>;
}
export {};
