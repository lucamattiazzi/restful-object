export declare type HandlerFunction = (path: string, options: RequestInit) => any;
export declare function RecursiveProxy(handlerFn?: HandlerFunction, options?: RequestInit, path?: (string | number)[]): void;
