const { RecursiveProxy } = require('./dist/index')
const http = require('http')
const port = 3000

const api = new RecursiveProxy(`http://localhost:${port}`, { headers: { xauth: 'astst' } }, true)

http
	.createServer(function(req, res) {
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ url: req.url, method: req.method }))
	})
	.listen(port)

const start = async () => {
	await api.author(1).get()
	await api.author(1).get()
	await api.author(1).post()
	console.log(api._cache)
	process.exit(1)
}

start()
