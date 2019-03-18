# Restful Object

This is a project to create a nice way to get some resource out of a Rest API.
The idea is to use a syntax that seems closer to the way one is used to retrieve resources from, say, an object.

e.g. :

```
const myPosts = await api.users(1).posts.get()
```

When instantiated, any fetching library can be used, but in the `example.js` you will see a simple implementation with `node-fetch` (isomorphic with `window.fetch`) and a simple server that returns as response a JSON object with `url`, set as the path of the request, and `method`, as the method.

```
const api = new RecursiveProxy(`http://localhost:3000`, {})

const results = api
  .author(1)
  .posts(3)
  .get()
  .then(res => console.log(res))
// { url: '/author/1/posts/3', method: 'GET' }
```

The third argument when instantiated is wheter if there should be a cache. The cache is (currently) as naive as possible: if a GET request is made, the resulting json will be saved with the time of request in order to be (if and when implemented) invalidated.

```
const api = new RecursiveProxy(`http://localhost:3000`, {}, true)

const start = async () => {
  await api.author(1).get() // this will actually fetch and set cache
  await api.author(1).get() // this will retrieve from cache
  await api.author(1).post() // this will fetch and NOT cache anything
  console.log(api._cache) // the map with the cache
}
```
