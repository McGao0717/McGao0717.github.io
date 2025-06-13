import winston from 'winston';
export declare function createTestLogger(): winston.Logger;
export declare function createMockPerformanceMonitor(): {
    record: jest.Mock<any, any, any>;
    getAverageDuration: jest.Mock<any, any, any>;
    getSuccessRate: jest.Mock<any, any, any>;
    getReport: jest.Mock<any, any, any>;
    clear: jest.Mock<any, any, any>;
};
export declare function createTestConfig(): {
    apiKey: string;
    apiBaseUrl: string;
    modelVersion: string;
    maxRetries: number;
    timeout: number;
    debug: boolean;
    logLevel: string;
};
export declare function createMockAxios(): {
    post: jest.Mock<any, any, any>;
    get: jest.Mock<any, any, any>;
    put: jest.Mock<any, any, any>;
    delete: jest.Mock<any, any, any>;
};
export declare function createMockFormData(): {
    append: jest.Mock<any, any, any>;
    getHeaders: jest.Mock<any, any, any>;
};
export declare function createMockMCPClient(): {
    connect: jest.Mock<any, any, any>;
    disconnect: jest.Mock<any, any, any>;
    subscribe: jest.Mock<any, any, any>;
    publish: jest.Mock<any, any, any>;
};
export declare function createTestFile(content?: string | Buffer): {
    path: string;
    buffer: Buffer<ArrayBuffer>;
};
export declare function mockApiResponse(data: any): {
    data: any;
    status: number;
    statusText: string;
    headers: {};
    config: {};
};
export declare function mockApiError(status?: number, message?: string): Error;
export declare function waitForEvent(emitter: any, event: string): Promise<any>;
export declare function sleep(ms: number): Promise<void>;
