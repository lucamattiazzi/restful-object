export type HandlerFunction = (path: string, options: RequestInit) => any

const voidFn = (): void => {}

const methodHandlers = {
	get: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (
		body?: string | string[][] | Record<string, string> | URLSearchParams,
		specificOptions: RequestInit = {},
	) => {
		const urlParams = new URLSearchParams(body)
		const completePath = body ? `${path}?${urlParams.toString()}` : path
		const completeOptions = Object.assign({}, options, specificOptions, { method: 'GET' })
		if (handlerFn) return handlerFn(completePath, completeOptions)
		return { path: completePath, options: completeOptions }
	},
	post: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (
		rawBody: Object | string,
		specificOptions: RequestInit = {},
	) => {
		const body = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody)
		const completeOptions = Object.assign({}, options, specificOptions, {
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
		const completeOptions = Object.assign({}, options, specificOptions, { method: 'PUT', body })
		if (handlerFn) return handlerFn(path, completeOptions)
		return { path, options: completeOptions }
	},
	delete: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (
		body?: string | number,
		specificOptions: RequestInit = {},
	) => {
		const completeOptions = Object.assign({}, options, specificOptions, { method: 'DELETE' })
		if (handlerFn) return handlerFn(path, completeOptions)
		return { path, options: completeOptions }
	},
}

export function RecursiveProxy(
	handlerFn?: HandlerFunction,
	options?: RequestInit,
	path: (string | number)[] = [],
): void {
	function get(obj: Function, key: string) {
		if (obj.hasOwnProperty(key)) return obj[key]
		if (methodHandlers.hasOwnProperty(key)) {
			const joinedPath = path.join('/')
			return methodHandlers[key](joinedPath, options, handlerFn)
		}
		if (typeof key === 'string') {
			const completePath = [...path, key]
			return new RecursiveProxy(handlerFn, options, completePath)
		} else {
			return () => path
		}
	}
	function apply(_, __, args = []) {
		const completePath = [...path, ...args]
		const proxiedResult = new RecursiveProxy(handlerFn, options, completePath)
		return proxiedResult
	}
	return new Proxy(voidFn, { get, apply })
}
