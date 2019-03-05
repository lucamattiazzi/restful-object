const { RecursiveProxy } = require('./dist/index')

const baseFn = (path, options) => {
	return [path]
}

const proxied = new RecursiveProxy(baseFn, { headers: { xauth: 'astst' } })

const results = proxied.api.community.groups(4).recipes.get({ author: 'asdasd' })
console.log('results', results)
