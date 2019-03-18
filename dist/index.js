"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const fetch = typeof window === 'undefined' ? require('node-fetch') : window.fetch;
const voidFn = () => { };
const methodHandlers = {
    get: (path, options, handlerFn) => (body, specificOptions = {}) => {
        const urlParams = new URLSearchParams(body);
        const completePath = body ? `${path}?${urlParams.toString()}` : path;
        const completeOptions = lodash_1.merge({}, options, specificOptions, { method: 'GET' });
        if (handlerFn)
            return handlerFn(completePath, completeOptions);
        return { path: completePath, options: completeOptions };
    },
    post: (path, options, handlerFn) => (rawBody, specificOptions = {}) => {
        const body = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
        const completeOptions = lodash_1.merge({}, options, specificOptions, {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (handlerFn)
            return handlerFn(path, completeOptions);
        return { path, options: completeOptions };
    },
    put: (path, options, handlerFn) => (rawBody, specificOptions = {}) => {
        const body = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
        const completeOptions = lodash_1.merge({}, options, specificOptions, { method: 'PUT', body });
        if (handlerFn)
            return handlerFn(path, completeOptions);
        return { path, options: completeOptions };
    },
    patch: (path, options, handlerFn) => (rawBody, specificOptions = {}) => {
        const body = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
        const completeOptions = lodash_1.merge({}, options, specificOptions, { method: 'PATCH', body });
        if (handlerFn)
            return handlerFn(path, completeOptions);
        return { path, options: completeOptions };
    },
    delete: (path, options, handlerFn) => (body, specificOptions = {}) => {
        const completeOptions = lodash_1.merge({}, options, specificOptions, { method: 'DELETE' });
        if (handlerFn)
            return handlerFn(path, completeOptions);
        return { path, options: completeOptions };
    },
};
function RecursiveProxy(basePath, options = {}, cached = false, cache = new Map(), path = []) {
    const handlerFn = (path, options) => __awaiter(this, void 0, void 0, function* () {
        if (cached && cache.has(path))
            return Promise.resolve(cache.get(path));
        const url = `${basePath}/${path}`;
        const results = yield fetch(url, options);
        const json = yield results.json();
        if (cached)
            cache.set(path, json);
        console.log('cache', cache);
        return json;
    });
    function get(obj, key) {
        if (obj.hasOwnProperty(key))
            return obj[key];
        if (key === '_cache')
            return cache;
        if (methodHandlers.hasOwnProperty(key)) {
            const joinedPath = path.join('/');
            return methodHandlers[key](joinedPath, options, handlerFn);
        }
        if (typeof key === 'string') {
            const completePath = [...path, key];
            return new RecursiveProxy(basePath, options, cached, cache, completePath);
        }
        else {
            return () => path;
        }
    }
    function apply(_, __, args = []) {
        const completePath = [...path, ...args];
        const proxiedResult = new RecursiveProxy(basePath, options, cached, cache, completePath);
        return proxiedResult;
    }
    return new Proxy(voidFn, { get, apply });
}
exports.RecursiveProxy = RecursiveProxy;
