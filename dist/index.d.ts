export declare type HandlerFunction = (path: string, options: RequestInit) => any;
export declare function RecursiveProxy(basePath: string, options?: RequestInit, cached?: boolean, cache?: Map<string, any>, path?: (string | number)[]): void;
