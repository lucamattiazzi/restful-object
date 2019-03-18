const { RecursiveProxy } = require('./dist/index')
const fetch = require('node-fetch')
const http = require('http')
const port = 2005

const fetcher = (path, options) => {
	const url = `http://localhost:${port}/${path}`
	return fetch(url, options).then(res => res.json())
}

const api = new RecursiveProxy(fetcher, { headers: { xauth: 'astst' } })

http
	.createServer(function(req, res) {
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
	process.exit(1)
}

start()
