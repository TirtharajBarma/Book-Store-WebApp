const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  methods: 'GET,POST,PATCH,DELETE',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const bookCollections = client.db("BookInventory").collection("books");

    // Insert a book
    app.post("/upload-book", async (req, res) => {
      try {
        const data = req.body;
        const result = await bookCollections.insertOne(data);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ message: "Error inserting book" });
      }
    });

    // Get all books
    app.get("/all-books", async (req, res) => {
      try {
        let query = {};
        if (req.query?.category) {
          query = { category: req.query.category };
        }
        const books = await bookCollections.find(query).toArray();
        res.send(books);
      } catch (error) {
        res.status(500).send({ message: "Error fetching books" });
      }
    });

    // Update a book
    app.patch("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateBookData = req.body;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = { $set: { ...updateBookData } };
        const options = { upsert: true };
        const result = await bookCollections.updateOne(filter, updatedDoc, options);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error updating book" });
      }
    });

    // Delete a book
    app.delete("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await bookCollections.deleteOne(filter);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error deleting book" });
      }
    });

    // Get a single book
    app.get("/book/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await bookCollections.findOne(filter);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching book" });
      }
    });

  } catch (err) {
    console.error(err);
  }
}

run();

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the book-store');
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
