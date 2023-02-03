const express = require('express')
const cluster = require('cluster')
const os = require('os')

const app = express()


function blockingCode(duration) {
    const init = Date.now()
    while (Date.now() - init < duration) {
        // Yuuuuge calculation
    }
}

app.get('/heavy', (req, res) => {
    console.log(process.pid);
    blockingCode(2000)
    res.send(`I was quick, wasn't I?? Btw I am ${process.pid} process.`)
})

app.get('/', (req, res) => {
    res.send(`Get off my lawn. ${process.pid}`)
})

if (cluster.isMaster) {
    console.log("Master process was born.");

    const MAX_WORKERS = os.cpus().length
    for (let index = 0; index < MAX_WORKERS; index++) {
        cluster.fork()
    }
} else {
    console.log("Worker process was born.");
    app.listen(8000, () => {
        console.log(`Worker ${process.pid} listening...`);
    })
}

