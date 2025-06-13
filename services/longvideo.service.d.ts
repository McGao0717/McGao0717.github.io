interface VideoDetail {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    duration: number;
    series: {
        id: string;
        name: string;
        episode: number;
        totalEpisodes: number;
    };
    quality: {
        resolution: string;
        bitrate: number;
    };
    playUrls: {
        [key: string]: string;
    };
    chapters: Array<{
        title: string;
        startTime: number;
        endTime: number;
    }>;
    createdAt: string;
    updatedAt: string;
}
interface AlbumInfo {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    totalEpisodes: number;
    categories: string[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}
export declare class LongVideoService {
    private readonly baseUrl;
    private readonly apiKey;
    constructor();
    getVideoDetail(videoId: string): Promise<VideoDetail>;
    getAlbumInfo(albumId: string): Promise<AlbumInfo>;
    getAlbumVideos(albumId: string, page: number, pageSize: number): Promise<any>;
    getVideoPlayInfo(videoId: string, quality: string): Promise<any>;
    getVideoChapters(videoId: string): Promise<any>;
    pushMediaInfo(mediaInfo: any): Promise<void>;
    pushMediaInfoBatch(mediaInfoList: any[]): Promise<void>;
    private getHeaders;
}
export {};
