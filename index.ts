export type HandlerFunction = (path: string, options: RequestInit) => any

const voidFn = (): void => {}

const methodHandlers = {
	get: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (
		body: string | string[][] | Record<string, string> | URLSearchParams,
	) => {
		const urlParams = new URLSearchParams(body)
		const completePath = `${path}?${urlParams.toString()}`
		const completeOptions = Object.assign({}, options, { method: 'GET' })
		if (handlerFn) return handlerFn(completePath, completeOptions)
		return { path: completePath, options: completeOptions }
	},
	post: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (body: Object) => {
		const completeOptions = Object.assign({}, options, { method: 'POST', body })
		if (handlerFn) return handlerFn(path, completeOptions)
		return { path, options: completeOptions }
	},
	put: (path: string, options: RequestInit, handlerFn: HandlerFunction) => (body: Object) => {
		const completeOptions = Object.assign({}, options, { method: 'PUT', body })
		if (handlerFn) return handlerFn(path, completeOptions)
		return { path, options: completeOptions }
	},
	delete: (path: string, options: RequestInit, handlerFn: HandlerFunction) => () => {
		const completeOptions = Object.assign({}, options, { method: 'DELETE' })
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
