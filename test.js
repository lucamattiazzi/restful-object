const { RecursiveProxy } = require('./dist/index')

const base = async (path, input) => {
	const url = `${path.join('/')}/${input}`
	return Promise.resolve(url)
}

const proxied = new RecursiveProxy(base)

proxied.api.author(2).then(r => console.log(r))
