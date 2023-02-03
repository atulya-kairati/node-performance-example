
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

- Horizontal Scaling.
- We begin with a single node process, which is our `master` process.
- `cluster` module along with the `master` works are a **Load Balancer**.
- And using `cluster` module, we `fork()` the `master` to create `worker` processes.
- We can have as many process as we want.
- The work is divided by the `master` between the `worker`s using **Round-robin** approach, so they have equal load.

**Note:** 
> When running on windows, node can't guarantee that the **Round-robin** approach is used. Due to how process are managed on windows.
> Node leaves the task of distributing load on the Windows OS.
> Windows is asshore. It won't divide task to the wrokers unless the server calls are frequent.


- We can use `cluster.isMaster` to differentiate b/w `master` and `worker`.
```js
if (cluster.isMaster) {
    console.log("Master process was born.");
    cluster.fork()
    cluster.fork()
} else {
    console.log("Worker process was born.");
    app.listen(8000, () => {
        console.log(`Worker ${process.pid} listening...`);
    })
}

```

Limitations: 
- If the no of the requests are greater than the clusters in the time when blocking code is running on all clusters.
- Then the new requets will be delayed.
- And since the no. of the clusters that can be created are limited by the no. of logical/physical core in the CPU.
- We should only create `workers` equal to the no of logical cores.

```js
if (cluster.isMaster) {
    console.log("Master process was born.");

    const MAX_WORKERS = os.cpus().length // getting no of cores
    for (let index = 0; index < MAX_WORKERS; index++) {
        cluster.fork()
    }
} else {
    console.log("Worker process was born.");
    app.listen(8000, () => {
        console.log(`Worker ${process.pid} listening...`);
    })
}

```

***
