// warehouse management server
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const jwt = require('jsonwebtoken');
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// verify JWT or create JWT middleware
function verifyJWT(req, res, next){
    const headersAuth = req.headers.authorization;    
    if(headersAuth){
        const token = headersAuth.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) =>{
            if(err){
                return res.status(403).send({message: "Forbidden Access !!!"})
            }
            req.decoded = decoded;
            next();
        })
    } else{
        return res.status(401).send({message: "Unauthorized Access !!!"});
    }
}

// connect MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzn4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const productCollection = client.db("warehouseManagement").collection("product");

    // AUTH API's
    // creating token for user while login
    app.post('/login', async(req, res) =>{
        const user = req.body;
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        res.send({accessToken})
    })


    // PRODUCTS API's
    //  GET : Read all data from database
    // http://localhost:5000/products
    app.get("/products", async(req, res)=>{
        const query = {};
        const cursor = productCollection.find(query)
        const products = await cursor.toArray();
        res.send(products)
    })

    // GET : Read or load single data from database
    // http://localhost:5000/products/${id}
    app.get("/products/:id", async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await productCollection.findOne(query);
        res.send(result);
    })

    // GET : Read data filtered by Email
    app.get("/product",verifyJWT, async(req, res)=>{
        const decodedEmail = req.decoded?.email; 
        const email = req.query.email;
        if(email === decodedEmail){
            const filter = { email : email };
            const cursor = productCollection.find(filter)
            const filterProducts = await cursor.toArray();
            res.send(filterProducts);
        } else{
            res.status(403).send({message: "Forbidden Access !!!"})
        }
    })

    // POST : Create new product
    // http://localhost:5000/product
    app.post("/product", async(req, res)=>{
        const data = req.body;
        const result = await productCollection.insertOne(data);
        res.send(result);
    })

    // PUT : Update a specific product
    // http://localhost:5000/products/${id}
    app.put("/products/:id", async(req, res)=>{
        const id = req.params.id;
        const data = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const  updateQuantity ={
            $set : {
                quantity : data.quantity
            }
        };     
        const result = await productCollection.updateOne(filter, updateQuantity, options);
        res.send(result);
    })

    // DELETE : Delete a specific product
    // http://localhost:5000/products/${id}
    app.delete("/product/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await productCollection.deleteOne(query);
        res.send(result);
    })

      
    } finally {

    }
  }
  run().catch(console.dir);

// test the server 
app.get('/', (req,res)=>{
    res.send("Waerhouse server is running.")
})

// Listening the port
app.listen(port, ()=>{
    console.log("Waerhouse server is listening from the port: ", port)
})