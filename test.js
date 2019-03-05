const { RecursiveProxy } = require('./dist/index')

function asd(path, options) {
	console.log(path)
}
const proxied = new RecursiveProxy(asd, { headers: { xauth: 'astst' } })
const results = proxied.community.recipes.author()
