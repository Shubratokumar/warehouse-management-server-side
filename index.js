// warehouse management server
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// connect MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzn4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const productCollection = client.db("wearhouseManagement").collection("product");

    //  GET : Read data from database
    // http://localhost:5000/products
    app.get("/products", async(req, res)=>{
        const query = {};
        const cursor = productCollection.find(query)
        const result = await cursor.toArray()
        res.send(result)
    })

    // POST : Create new product
    // http://localhost:5000/product
    app.post("/product", async(req, res)=>{
        const data = req.body;
        const result = await productCollection.insertOne(data);
        res.send(result)
    })

    // PUT : Update a specific product
    // http://localhost:5000/product/${id}
    app.put("/product/:id", async(req, res)=>{
        const id = req.params.id;
        const data = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const  updateProduct ={
            $set : {
                ...data
            }
        };
        const result = await productCollection.updateOne(filter, updateProduct, options);
        res.send(result)
    })

    // DELETE : Delete a specific product
    // http://localhost:5000/product/${id}
    app.delete("/product/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await productCollection.deleteOne(query);
        res.send(result)
    })

      
    } finally {

    }
  }
  run().catch(console.dir);



// test the server 
app.get('/', (req,res)=>{
    res.send("Wearhouse server is running.")
})

// Listening the port
app.listen(port, ()=>{
    console.log("Wearhouse server is listening from the port: ", port)
})