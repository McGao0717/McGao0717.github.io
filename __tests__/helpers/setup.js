"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestLogger = createTestLogger;
exports.createMockPerformanceMonitor = createMockPerformanceMonitor;
exports.createTestConfig = createTestConfig;
exports.createMockAxios = createMockAxios;
exports.createMockFormData = createMockFormData;
exports.createMockMCPClient = createMockMCPClient;
exports.createTestFile = createTestFile;
exports.mockApiResponse = mockApiResponse;
exports.mockApiError = mockApiError;
exports.waitForEvent = waitForEvent;
exports.sleep = sleep;
const winston_1 = __importDefault(require("winston"));
function createTestLogger() {
    return winston_1.default.createLogger({
        level: 'debug',
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
        transports: [
            new winston_1.default.transports.Console({
                format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
            })
        ],
        silent: process.env.NODE_ENV === 'test'
    });
}
function createMockPerformanceMonitor() {
    return {
        record: jest.fn(),
        getAverageDuration: jest.fn(),
        getSuccessRate: jest.fn(),
        getReport: jest.fn(),
        clear: jest.fn()
    };
}
function createTestConfig() {
    return {
        apiKey: 'test_api_key',
        apiBaseUrl: 'http://localhost:3000',
        modelVersion: 'v1',
        maxRetries: 3,
        timeout: 5000,
        debug: true,
        logLevel: 'debug'
    };
}
function createMockAxios() {
    return {
        post: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
    };
}
function createMockFormData() {
    return {
        append: jest.fn(),
        getHeaders: jest.fn().mockReturnValue({
            'content-type': 'multipart/form-data'
        })
    };
}
function createMockMCPClient() {
    return {
        connect: jest.fn().mockResolvedValue(undefined),
        disconnect: jest.fn().mockResolvedValue(undefined),
        subscribe: jest.fn().mockResolvedValue(undefined),
        publish: jest.fn().mockResolvedValue(undefined)
    };
}
function createTestFile(content = 'test content') {
    return {
        path: 'test.txt',
        buffer: Buffer.from(content)
    };
}
function mockApiResponse(data) {
    return {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
    };
}
function mockApiError(status = 500, message = 'Internal Server Error') {
    const error = new Error(message);
    error.response = {
        status,
        statusText: message,
        data: { error: message }
    };
    return error;
}
function waitForEvent(emitter, event) {
    return new Promise(resolve => {
        emitter.once(event, resolve);
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=setup.js.map