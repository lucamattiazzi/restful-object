export declare type HandlerFunction = (path: string, options: RequestInit) => any;
export declare function RecursiveProxy(basePath: string, options?: RequestInit, withCache?: boolean, cache?: Map<object, any>, path?: (string | number)[]): void;
