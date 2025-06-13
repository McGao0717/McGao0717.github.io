import { Client } from '@elastic/elasticsearch';
declare const esClient: Client;
declare const VIDEO_INDEX_MAPPING: {
    mappings: {
        properties: {
            id: {
                type: string;
            };
            platform: {
                type: string;
            };
            title: {
                type: string;
                analyzer: string;
                search_analyzer: string;
                fields: {
                    keyword: {
                        type: string;
                    };
                };
            };
            description: {
                type: string;
                analyzer: string;
                search_analyzer: string;
            };
            author: {
                properties: {
                    id: {
                        type: string;
                    };
                    nickname: {
                        type: string;
                        fields: {
                            keyword: {
                                type: string;
                            };
                        };
                    };
                };
            };
            tags: {
                type: string;
                fields: {
                    keyword: {
                        type: string;
                    };
                };
            };
            stats: {
                properties: {
                    views: {
                        type: string;
                    };
                    likes: {
                        type: string;
                    };
                    comments: {
                        type: string;
                    };
                    shares: {
                        type: string;
                    };
                };
            };
            createdAt: {
                type: string;
            };
            updatedAt: {
                type: string;
            };
        };
    };
    settings: {
        analysis: {
            analyzer: {
                ik_max_word: {
                    type: string;
                    tokenizer: string;
                };
                ik_smart: {
                    type: string;
                    tokenizer: string;
                };
            };
        };
    };
};
declare const ES_INDICES: {
    readonly VIDEO: "videos";
    readonly VIDEO_STATS: "video_stats";
    readonly VIDEO_TRENDS: "video_trends";
};
declare const esUtils: {
    indexVideo(video: any): Promise<boolean>;
    searchVideos(query: string, options?: {
        from?: number;
        size?: number;
        platform?: string;
        sort?: string;
    }): Promise<any>;
    getHotTags(size?: number): Promise<Array<{
        key: string;
        doc_count: number;
    }>>;
};
export { esClient, VIDEO_INDEX_MAPPING, ES_INDICES, esUtils };
