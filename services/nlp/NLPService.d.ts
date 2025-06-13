import { EventEmitter } from 'events';
import { Config } from '../../types';
declare class NLPService extends EventEmitter {
    private tokenizer;
    private hf;
    private config;
    constructor(config: Config);
    /**
     * 文本分词
     */
    tokenize(text: string): Promise<string[]>;
    /**
     * 命名实体识别
     */
    performNER(text: string): Promise<any>;
    /**
     * 情感分析
     */
    analyzeSentiment(text: string): Promise<any>;
    /**
     * 文本生成
     */
    generateText(prompt: string, options?: any): Promise<any>;
    /**
     * 文本摘要
     */
    summarizeText(text: string, options?: any): Promise<any>;
    /**
     * 问答系统
     */
    answerQuestion(context: string, question: string): Promise<any>;
}
export default NLPService;
