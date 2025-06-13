import { EventEmitter } from 'events';
import winston from 'winston';
export interface PerformanceMetric {
    operation: string;
    duration: number;
    timestamp: number;
    success: boolean;
}
export interface OperationStats {
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    averageDuration: number;
    successRate: number;
    metrics: PerformanceMetric[];
}
export interface PerformanceReport {
    [operation: string]: OperationStats;
}
export declare class PerformanceMonitor extends EventEmitter {
    private metrics;
    private readonly maxMetricsPerOperation;
    private readonly logger;
    constructor(logger: winston.Logger, maxMetricsPerOperation?: number);
    /**
     * 记录性能指标
     */
    record(operation: string, duration: number, success: boolean): void;
    /**
     * 获取指定操作的平均持续时间
     */
    getAverageDuration(operation: string): number;
    /**
     * 获取指定操作的成功率
     */
    getSuccessRate(operation: string): number;
    /**
     * 获取性能报告
     */
    getReport(): PerformanceReport;
    /**
     * 清除所有指标
     */
    clear(): void;
}
export declare function monitor(operationName: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export default PerformanceMonitor;
