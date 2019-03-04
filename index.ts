type InputFunction = Function | Object

function RecursiveProxy(originalFn: InputFunction, path: string[] = []): void {
	function get(obj: InputFunction, key: string) {
		if (obj.hasOwnProperty(key)) return obj[key]
		if (typeof key === 'string') {
			const completePath = [...path, key]
			return new RecursiveProxy(obj, completePath)
		} else {
			return () => path
		}
	}
	function apply(fn, that, args) {
		// TODO: Allow concatenation of functions (somehow)
		// const completePath = [...path, args]
		// const results = fn(path, ...args)
		// const proxiedResult = new RecursiveProxy(() => results, completePath)
		return fn(path, ...args)
	}
	return new Proxy(originalFn, { get, apply })
}

module.exports = { RecursiveProxy }
