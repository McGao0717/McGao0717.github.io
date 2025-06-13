export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data?: T;
    timestamp: number;
    requestId: string;
    traceId?: string;
    duration?: number;
    server?: string;
    version?: string;
}
export interface PaginationData<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
}
export interface PaginatedResponse<T> extends Omit<ApiResponse<PaginationData<T>>, 'data'> {
    data: PaginationData<T>;
}
export declare enum ApiErrorCode {
    SYSTEM_ERROR = 1000,
    NETWORK_ERROR = 1001,
    DATABASE_ERROR = 1002,
    CACHE_ERROR = 1003,
    SEARCH_ENGINE_ERROR = 1004,
    SERVICE_UNAVAILABLE = 1005,
    TIMEOUT_ERROR = 1006,
    RATE_LIMIT_ERROR = 1007,
    UNAUTHORIZED = 2000,
    INVALID_TOKEN = 2001,
    TOKEN_EXPIRED = 2002,
    INVALID_SIGNATURE = 2003,
    PERMISSION_DENIED = 2004,
    API_KEY_INVALID = 2005,
    API_KEY_EXPIRED = 2006,
    RATE_LIMIT_EXCEEDED = 2007,
    IP_BLOCKED = 2008,
    ACCOUNT_DISABLED = 2009,
    INVALID_PARAMS = 3000,
    MISSING_REQUIRED_PARAMS = 3001,
    INVALID_FORMAT = 3002,
    VALIDATION_FAILED = 3003,
    INVALID_CONTENT_TYPE = 3004,
    PAYLOAD_TOO_LARGE = 3005,
    TOO_MANY_REQUESTS = 3006,
    RESOURCE_NOT_FOUND = 4000,
    RESOURCE_ALREADY_EXISTS = 4001,
    RESOURCE_EXPIRED = 4002,
    OPERATION_FAILED = 4003,
    BUSINESS_RULE_VIOLATION = 4004,
    STATE_CONFLICT = 4005,
    QUOTA_EXCEEDED = 4006,
    DOUYIN_API_ERROR = 5000,
    XIAOHONGSHU_API_ERROR = 5001,
    LONGVIDEO_API_ERROR = 5002,
    THIRD_PARTY_ERROR = 5003,
    API_DEPRECATED = 5004,
    SERVICE_MAINTENANCE = 5005
}
export declare const ApiErrorMessages: Record<ApiErrorCode, string>;
