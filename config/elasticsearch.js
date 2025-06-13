"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esUtils = exports.ES_INDICES = exports.VIDEO_INDEX_MAPPING = exports.esClient = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const logger_1 = require("../utils/logger");
// Elasticsearch客户端配置
const esClient = new elasticsearch_1.Client({
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || ''
    }
});
exports.esClient = esClient;
// 视频索引映射
const VIDEO_INDEX_MAPPING = {
    mappings: {
        properties: {
            id: { type: 'keyword' },
            platform: { type: 'keyword' },
            title: {
                type: 'text',
                analyzer: 'ik_max_word',
                search_analyzer: 'ik_smart',
                fields: {
                    keyword: { type: 'keyword' }
                }
            },
            description: {
                type: 'text',
                analyzer: 'ik_max_word',
                search_analyzer: 'ik_smart'
            },
            author: {
                properties: {
                    id: { type: 'keyword' },
                    nickname: {
                        type: 'text',
                        fields: {
                            keyword: { type: 'keyword' }
                        }
                    }
                }
            },
            tags: {
                type: 'text',
                fields: {
                    keyword: { type: 'keyword' }
                }
            },
            stats: {
                properties: {
                    views: { type: 'long' },
                    likes: { type: 'long' },
                    comments: { type: 'long' },
                    shares: { type: 'long' }
                }
            },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' }
        }
    },
    settings: {
        analysis: {
            analyzer: {
                ik_max_word: {
                    type: 'custom',
                    tokenizer: 'ik_max_word'
                },
                ik_smart: {
                    type: 'custom',
                    tokenizer: 'ik_smart'
                }
            }
        }
    }
};
exports.VIDEO_INDEX_MAPPING = VIDEO_INDEX_MAPPING;
// 索引名称常量
const ES_INDICES = {
    VIDEO: 'videos',
    VIDEO_STATS: 'video_stats',
    VIDEO_TRENDS: 'video_trends'
};
exports.ES_INDICES = ES_INDICES;
// Elasticsearch操作工具函数
const esUtils = {
    // 创建或更新视频文档
    async indexVideo(video) {
        try {
            await esClient.index({
                index: ES_INDICES.VIDEO,
                id: video.id,
                document: video
            });
            return true;
        }
        catch (error) {
            logger_1.logger.error('Elasticsearch index error:', error);
            return false;
        }
    },
    // 搜索视频
    async searchVideos(query, options = {}) {
        const { from = 0, size = 10, platform, sort } = options;
        try {
            const searchQuery = {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query,
                                fields: ['title^2', 'description', 'tags', 'author.nickname']
                            }
                        }
                    ],
                    ...(platform && {
                        filter: [{ term: { platform } }]
                    })
                }
            };
            const result = await esClient.search({
                index: ES_INDICES.VIDEO,
                from,
                size,
                sort: sort ? [sort] : [{ createdAt: 'desc' }],
                query: searchQuery
            });
            return result.hits;
        }
        catch (error) {
            logger_1.logger.error('Elasticsearch search error:', error);
            return null;
        }
    },
    // 获取热门标签
    async getHotTags(size = 10) {
        try {
            const result = await esClient.search({
                index: ES_INDICES.VIDEO,
                size: 0,
                aggs: {
                    hot_tags: {
                        terms: {
                            field: 'tags.keyword',
                            size
                        }
                    }
                }
            });
            // Type assertion to handle the aggregation result
            const hotTags = result.aggregations?.hot_tags;
            return hotTags?.buckets || [];
        }
        catch (error) {
            logger_1.logger.error('Elasticsearch aggregation error:', error);
            return [];
        }
    }
};
exports.esUtils = esUtils;
//# sourceMappingURL=elasticsearch.js.map