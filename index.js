// warehouse management server
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// connect MongoDB

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://shubrato:<password>@cluster0.gzn4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log("connected DB")
//   client.close();
});



// test the server 
app.get('/', (req,res)=>{
    res.send("Wearhouse server is running.")
})

// Listening the port
app.listen(port, ()=>{
    console.log("Wearhouse server is listening from the port: ", port)
})