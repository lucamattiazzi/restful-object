import { merge } from 'lodash'
const fetch = typeof window === 'undefined' ? require('node-fetch') : window.fetch

export type HandlerFunction = (path: string, options: RequestInit) => any

const voidFn = (): void => {}

const methodHandlers = {
	get: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (
		body?: string | string[][] | Record<string, string> | URLSearchParams,
		specificOptions: RequestInit = {},
	) => {
		const urlParams = new URLSearchParams(body)
		const completePath = body ? `${path}?${urlParams.toString()}` : path
		const completeOptions = merge({}, options, specificOptions, { method: 'GET' })
		if (handlerFn) return handlerFn(completePath, completeOptions)
		return { path: completePath, options: completeOptions }
	},
	post: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (
		rawBody: Object | string,
		specificOptions: RequestInit = {},
	) => {
		const body = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody)
		const completeOptions = merge({}, options, specificOptions, {
			method: 'POST',
			body,
			headers: {
				'Content-Type': 'application/json',
			},
		})
		if (handlerFn) return handlerFn(path, completeOptions)
		return { path, options: completeOptions }
	},
	put: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (
		rawBody: Object,
		specificOptions: RequestInit = {},
	) => {
		const body = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody)
		const completeOptions = merge({}, options, specificOptions, { method: 'PUT', body })
		if (handlerFn) return handlerFn(path, completeOptions)
		return { path, options: completeOptions }
	},
	patch: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (
		rawBody: Object,
		specificOptions: RequestInit = {},
	) => {
		const body = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody)
		const completeOptions = merge({}, options, specificOptions, { method: 'PATCH', body })
		if (handlerFn) return handlerFn(path, completeOptions)
		return { path, options: completeOptions }
	},
	delete: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (
		body?: string | number,
		specificOptions: RequestInit = {},
	) => {
		const completeOptions = merge({}, options, specificOptions, { method: 'DELETE' })
		if (handlerFn) return handlerFn(path, completeOptions)
		return { path, options: completeOptions }
	},
}

export function RecursiveProxy(
	basePath: string,
	options: RequestInit = {},
	cached: boolean = false,
	cache: Map<string, any> = new Map(),
	path: (string | number)[] = [],
): void {
	const handlerFn = async (path: string, options: RequestInit) => {
		if (cached && cache.has(path)) return Promise.resolve(cache.get(path))
		const url = `${basePath}/${path}`
		const results = await fetch(url, options)
		const json = await results.json()
		if (cached) cache.set(path, json)
		console.log('cache', cache)
		return json
	}
	function get(obj: Function, key: string) {
		if (obj.hasOwnProperty(key)) return obj[key]
		if (key === '_cache') return cache
		if (methodHandlers.hasOwnProperty(key)) {
			const joinedPath = path.join('/')
			return methodHandlers[key](joinedPath, options, handlerFn)
		}
		if (typeof key === 'string') {
			const completePath = [...path, key]
			return new RecursiveProxy(basePath, options, cached, cache, completePath)
		} else {
			return () => path
		}
	}
	function apply(_, __, args = []) {
		const completePath = [...path, ...args]
		const proxiedResult = new RecursiveProxy(basePath, options, cached, cache, completePath)
		return proxiedResult
	}
	return new Proxy(voidFn, { get, apply })
}
