declare type HandlerFunction = (path: string, options: RequestInit) => any;
declare const voidFn: () => void;
declare const methodHandlers: {
    get: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (body: string | Record<string, string> | URLSearchParams | string[][]) => any;
    post: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (body: Object) => any;
    put: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (body: Object) => any;
    delete: (path: string, options: RequestInit, handlerFn: HandlerFunction) => () => any;
};
declare function RecursiveProxy(handlerFn?: HandlerFunction, options?: RequestInit, path?: (string | number)[]): void;
