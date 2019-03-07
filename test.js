const { RecursiveProxy } = require('./dist/index')

function asd(path, options) {
	console.log(path, options)
}
const api = new RecursiveProxy(asd, { headers: { xauth: 'astst' } })

const results = api.v1
	.recipes(123)
	.groups(4)
	.get({ ingredients: 'food' })
