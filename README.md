
### Effect of blocking code

- Node.js is single threaded and it runs blocking code (like network calls and I/O) asynchronously.
- But some pieces of code can't be written as async.
- Like parsing a huge JSON object or doing a calculation which takes a lobg time (e.g. Cryptographic calc.).
- These factor can slow down the server resulting in delays.
- The delays will also add up depending on the no. of requests the server is getiing.

```js
function blockingCode(duration) {
    const init = Date.now()
    while(Date.now() - init < duration){
        // Yuuuuge calculation
    }
}

app.use('/heavy', (req, res) => {
    blockingCode(2000)
    res.send("I was quick, wasn't I??")
})
```
- Here, not only we will get a 2 sec delay when we request the `/heavy` route.
- But our whole server will be slowed down since the event loop will get locked down due to the blocking code.

### Imporving Performance

- We can create multiple node.js processes, each running our server and divided the work between them.
- One of the ways to achieve this is to use the nodes cluster module.

#### Clustering

- We begin with a single node process, which is our `master` process.
- And using `cluster` module, we `fork()` the `master` to create `worker` processes.
- We can have as many process as we want.
- The work is divided by the `master` between the `worker`s using **Round-robin** approach, so they have equal load.

**Note:** 
> When running on windows, node can't guarantee that the **Round-robin** approach is used. Due to how process are managed on windows.
> Node leaves the task of distributing load on the Windows OS.

