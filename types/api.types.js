"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrorMessages = exports.ApiErrorCode = void 0;
// API错误码定义
var ApiErrorCode;
(function (ApiErrorCode) {
    // 系统级错误 (1000-1999)
    ApiErrorCode[ApiErrorCode["SYSTEM_ERROR"] = 1000] = "SYSTEM_ERROR";
    ApiErrorCode[ApiErrorCode["NETWORK_ERROR"] = 1001] = "NETWORK_ERROR";
    ApiErrorCode[ApiErrorCode["DATABASE_ERROR"] = 1002] = "DATABASE_ERROR";
    ApiErrorCode[ApiErrorCode["CACHE_ERROR"] = 1003] = "CACHE_ERROR";
    ApiErrorCode[ApiErrorCode["SEARCH_ENGINE_ERROR"] = 1004] = "SEARCH_ENGINE_ERROR";
    ApiErrorCode[ApiErrorCode["SERVICE_UNAVAILABLE"] = 1005] = "SERVICE_UNAVAILABLE";
    ApiErrorCode[ApiErrorCode["TIMEOUT_ERROR"] = 1006] = "TIMEOUT_ERROR";
    ApiErrorCode[ApiErrorCode["RATE_LIMIT_ERROR"] = 1007] = "RATE_LIMIT_ERROR";
    // 认证和授权错误 (2000-2999)
    ApiErrorCode[ApiErrorCode["UNAUTHORIZED"] = 2000] = "UNAUTHORIZED";
    ApiErrorCode[ApiErrorCode["INVALID_TOKEN"] = 2001] = "INVALID_TOKEN";
    ApiErrorCode[ApiErrorCode["TOKEN_EXPIRED"] = 2002] = "TOKEN_EXPIRED";
    ApiErrorCode[ApiErrorCode["INVALID_SIGNATURE"] = 2003] = "INVALID_SIGNATURE";
    ApiErrorCode[ApiErrorCode["PERMISSION_DENIED"] = 2004] = "PERMISSION_DENIED";
    ApiErrorCode[ApiErrorCode["API_KEY_INVALID"] = 2005] = "API_KEY_INVALID";
    ApiErrorCode[ApiErrorCode["API_KEY_EXPIRED"] = 2006] = "API_KEY_EXPIRED";
    ApiErrorCode[ApiErrorCode["RATE_LIMIT_EXCEEDED"] = 2007] = "RATE_LIMIT_EXCEEDED";
    ApiErrorCode[ApiErrorCode["IP_BLOCKED"] = 2008] = "IP_BLOCKED";
    ApiErrorCode[ApiErrorCode["ACCOUNT_DISABLED"] = 2009] = "ACCOUNT_DISABLED";
    // 请求参数错误 (3000-3999)
    ApiErrorCode[ApiErrorCode["INVALID_PARAMS"] = 3000] = "INVALID_PARAMS";
    ApiErrorCode[ApiErrorCode["MISSING_REQUIRED_PARAMS"] = 3001] = "MISSING_REQUIRED_PARAMS";
    ApiErrorCode[ApiErrorCode["INVALID_FORMAT"] = 3002] = "INVALID_FORMAT";
    ApiErrorCode[ApiErrorCode["VALIDATION_FAILED"] = 3003] = "VALIDATION_FAILED";
    ApiErrorCode[ApiErrorCode["INVALID_CONTENT_TYPE"] = 3004] = "INVALID_CONTENT_TYPE";
    ApiErrorCode[ApiErrorCode["PAYLOAD_TOO_LARGE"] = 3005] = "PAYLOAD_TOO_LARGE";
    ApiErrorCode[ApiErrorCode["TOO_MANY_REQUESTS"] = 3006] = "TOO_MANY_REQUESTS";
    // 业务逻辑错误 (4000-4999)
    ApiErrorCode[ApiErrorCode["RESOURCE_NOT_FOUND"] = 4000] = "RESOURCE_NOT_FOUND";
    ApiErrorCode[ApiErrorCode["RESOURCE_ALREADY_EXISTS"] = 4001] = "RESOURCE_ALREADY_EXISTS";
    ApiErrorCode[ApiErrorCode["RESOURCE_EXPIRED"] = 4002] = "RESOURCE_EXPIRED";
    ApiErrorCode[ApiErrorCode["OPERATION_FAILED"] = 4003] = "OPERATION_FAILED";
    ApiErrorCode[ApiErrorCode["BUSINESS_RULE_VIOLATION"] = 4004] = "BUSINESS_RULE_VIOLATION";
    ApiErrorCode[ApiErrorCode["STATE_CONFLICT"] = 4005] = "STATE_CONFLICT";
    ApiErrorCode[ApiErrorCode["QUOTA_EXCEEDED"] = 4006] = "QUOTA_EXCEEDED";
    // 第三方平台错误 (5000-5999)
    ApiErrorCode[ApiErrorCode["DOUYIN_API_ERROR"] = 5000] = "DOUYIN_API_ERROR";
    ApiErrorCode[ApiErrorCode["XIAOHONGSHU_API_ERROR"] = 5001] = "XIAOHONGSHU_API_ERROR";
    ApiErrorCode[ApiErrorCode["LONGVIDEO_API_ERROR"] = 5002] = "LONGVIDEO_API_ERROR";
    ApiErrorCode[ApiErrorCode["THIRD_PARTY_ERROR"] = 5003] = "THIRD_PARTY_ERROR";
    ApiErrorCode[ApiErrorCode["API_DEPRECATED"] = 5004] = "API_DEPRECATED";
    ApiErrorCode[ApiErrorCode["SERVICE_MAINTENANCE"] = 5005] = "SERVICE_MAINTENANCE";
})(ApiErrorCode || (exports.ApiErrorCode = ApiErrorCode = {}));
// API错误消息映射
exports.ApiErrorMessages = {
    [ApiErrorCode.SYSTEM_ERROR]: '系统错误',
    [ApiErrorCode.NETWORK_ERROR]: '网络错误',
    [ApiErrorCode.DATABASE_ERROR]: '数据库错误',
    [ApiErrorCode.CACHE_ERROR]: '缓存服务错误',
    [ApiErrorCode.SEARCH_ENGINE_ERROR]: '搜索引擎错误',
    [ApiErrorCode.SERVICE_UNAVAILABLE]: '服务不可用',
    [ApiErrorCode.TIMEOUT_ERROR]: '请求超时',
    [ApiErrorCode.RATE_LIMIT_ERROR]: '速率限制错误',
    [ApiErrorCode.UNAUTHORIZED]: '未授权访问',
    [ApiErrorCode.INVALID_TOKEN]: '无效的访问令牌',
    [ApiErrorCode.TOKEN_EXPIRED]: '访问令牌已过期',
    [ApiErrorCode.INVALID_SIGNATURE]: '无效的签名',
    [ApiErrorCode.PERMISSION_DENIED]: '权限不足',
    [ApiErrorCode.API_KEY_INVALID]: '无效的API密钥',
    [ApiErrorCode.API_KEY_EXPIRED]: 'API密钥已过期',
    [ApiErrorCode.RATE_LIMIT_EXCEEDED]: '请求频率超限',
    [ApiErrorCode.IP_BLOCKED]: 'IP已被封禁',
    [ApiErrorCode.ACCOUNT_DISABLED]: '账号已被禁用',
    [ApiErrorCode.INVALID_PARAMS]: '无效的请求参数',
    [ApiErrorCode.MISSING_REQUIRED_PARAMS]: '缺少必需的参数',
    [ApiErrorCode.INVALID_FORMAT]: '无效的数据格式',
    [ApiErrorCode.VALIDATION_FAILED]: '数据验证失败',
    [ApiErrorCode.INVALID_CONTENT_TYPE]: '无效的内容类型',
    [ApiErrorCode.PAYLOAD_TOO_LARGE]: '请求数据过大',
    [ApiErrorCode.TOO_MANY_REQUESTS]: '请求过于频繁',
    [ApiErrorCode.RESOURCE_NOT_FOUND]: '资源不存在',
    [ApiErrorCode.RESOURCE_ALREADY_EXISTS]: '资源已存在',
    [ApiErrorCode.RESOURCE_EXPIRED]: '资源已过期',
    [ApiErrorCode.OPERATION_FAILED]: '操作失败',
    [ApiErrorCode.BUSINESS_RULE_VIOLATION]: '违反业务规则',
    [ApiErrorCode.STATE_CONFLICT]: '状态冲突',
    [ApiErrorCode.QUOTA_EXCEEDED]: '配额超限',
    [ApiErrorCode.DOUYIN_API_ERROR]: '抖音API调用失败',
    [ApiErrorCode.XIAOHONGSHU_API_ERROR]: '小红书API调用失败',
    [ApiErrorCode.LONGVIDEO_API_ERROR]: '长视频API调用失败',
    [ApiErrorCode.THIRD_PARTY_ERROR]: '第三方服务调用失败',
    [ApiErrorCode.API_DEPRECATED]: 'API已弃用',
    [ApiErrorCode.SERVICE_MAINTENANCE]: '服务维护中'
};
//# sourceMappingURL=api.types.js.map