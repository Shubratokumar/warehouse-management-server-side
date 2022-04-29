// warehouse management server
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;


// text the server 
app.get('/', (req,res)=>{
    res.send("wearhouse server is running.")
})

// Listening the port
app.listen(port, ()=>{
    console.log("Wearhouse server is listening from the port: ", port)
})