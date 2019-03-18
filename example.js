const { RecursiveProxy } = require('./dist/index')
const http = require('http')
const port = 2005

const api = new RecursiveProxy(`http://localhost:${port}`, { headers: { xauth: 'astst' } }, true)

http
	.createServer(function(req, res) {
		console.log('request!')
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ url: req.url, method: req.method }))
	})
	.listen(port)

const start = async () => {
	const results = await api
		.author(1)
		.posts(3)
		.get()
	console.log('results', results)
	await api
		.author(1)
		.posts(3)
		.get()
	console.log(api._cache)
	process.exit(1)
}

start()
