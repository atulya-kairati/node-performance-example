const express = require('express')

const app = express()


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

app.use('/', (req, res) => {
    res.send("Get off my lawn.")
})

app.listen(8000, ()=>{
    console.log("Listening...");
})