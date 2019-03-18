# Restful Object

This is a project to create a nice way to get some resource out of a Rest API.
The idea is to use a syntax that seems closer to the way one is used to retrieve resources from, say, an object.

e.g. :

```
const myPosts = await api.users(1).posts.get()
```

When instantiated, any fetching library can be used, but in the `example.js` you will see a simple implementation with `node-fetch` (isomorphic with `window.fetch`) and a simple server that returns as response a JSON object with `url`, set as the path of the request, and `method`, as the method.

```
const fetcher = (path, options) => {
  const url = `http://localhost:${port}/${path}`
  return fetch(url, options).then(res => res.json())
}

const api = new RecursiveProxy(fetcher, { headers: { xauth: 'astst' } })

const results = api
  .author(1)
  .posts(3)
  .get()
  .then(res => console.log(res))
// { url: '/author/1/posts/3', method: 'GET' }
```
