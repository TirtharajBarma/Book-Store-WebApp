const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

//middleware
//connection to frontend side
app.use(cors());
app.use(express.json());

//db connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//const URI connects to mongodb to this file
//change the username and password as per your need
const uri = process.env.MONGODB_URI;
// const uri = "mongodb+srv://<username>:<password>@cluster39842.cpbmic9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster39842";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //* write the code here ->
    //create a collection of documents
    //database name => bookCollections
    const bookCollections = client.db("BookInventory").collection("books");
    
    //insert a book to the db using post method
    // to upload anything we use post method
    app.post("/upload-book", async(req, res) => {
        //In Express.js, req.body is a property that contains the data sent in the body of the request.
        // By assigning req.body to the variable data
        const data = req.body;
        //database name => bookCollections
        const result = await bookCollections.insertOne(data);
        res.send(result);
    });
    
    //fetch books from the database
    //to get data -> find the data
    app.get("/all-books", async(req, res) => {
        const books = await bookCollections.find();
        const result = await books.toArray();
        res.send(result);
    });
    
    //50.00
    //update a book data
    //use patch or update methods
    app.patch("/book/:id", async(req, res) => {
        const id = req.params.id;
        // console.log(id);
        //.body we will take the information from the body
        const updateBookData = req.body;
        // new id changes
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
            $set: {
                ...updateBookData
            }
        }
        const options = {upsert: true};
        //update
        const result = await bookCollections.updateOne(filter, updatedDoc ,options);
        res.send(result);
    });

    //1.00.00
    //delete a book data
    app.delete("/book/:id", async(req, res) => {
        // id -> store the id to be deleted
        const id = req.params.id;
        // filtering the id
        const filter = { _id: new ObjectId(id)};
        //storing the data into result
        const result = await bookCollections.deleteOne(filter);
        res.send(result);
    });

    // 1.04.00
    // filter data
    app.get("/all-books", async(req, res) => {
        let query = {};
        if(req.query?.category){
            query = {category: req.query.category};
        }
        const result = await bookCollections.find(query).toArray();
        res.send(result);
    });

    // to get single book data
    app.get("/book/:id", async(req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id)};
        const result = await bookCollections.findOne(filter);
        res.send(result);
    });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to the book-store');
});

app.listen(port, () => {
    console.log(`Example app is listening on port ${port}`);
});