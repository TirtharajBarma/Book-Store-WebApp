const express = require('express');
const app = express();
const port = process.env.PORT || 5002;
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

//middleware
//connection to frontend side
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5002', 'https://book-store-web-app-azure.vercel.app', 'https://bookstore.tirtharajbarma.tech' ,'http://bookstore.tirtharajbarma.tech'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

//db connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//const URI connects to mongodb to this file
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,  // Changed to false to support distinct command
    deprecationErrors: true,
  }
});

// Global variables for collections
let bookCollections, userCollections, analyticsCollections;
let isDbConnected = false;

// Database connection with error handling
async function connectToDatabase() {
  try {
    if (!isDbConnected) {
      await client.connect();
      
      bookCollections = client.db("BookInventory").collection("books");
      userCollections = client.db("BookInventory").collection("users");
      analyticsCollections = client.db("BookInventory").collection("analytics");
      
      // Test the connection
      await client.db("admin").command({ ping: 1 });
      isDbConnected = true;
      console.log("Successfully connected to MongoDB!");
    }
    return true;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    isDbConnected = false;
    return false;
  }
}

// Middleware to ensure database connection
const ensureDbConnection = async (req, res, next) => {
  try {
    if (!isDbConnected) {
      const connected = await connectToDatabase();
      if (!connected) {
        return res.status(500).json({ error: 'Database connection failed' });
      }
    }
    next();
  } catch (error) {
    console.error('Database middleware error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
};

// Basic route (no DB needed)
app.get('/', (req, res) => {
    res.send('Welcome to the book-store');
});

// Apply database middleware to all routes that need DB
app.use('/upload-book', ensureDbConnection);
app.use('/book*', ensureDbConnection);
app.use('/all-books', ensureDbConnection);
app.use('/popular-books', ensureDbConnection);
app.use('/user*', ensureDbConnection);
app.use('/users', ensureDbConnection);
app.use('/analytics*', ensureDbConnection);

//insert a book to the db using post method
app.post("/upload-book", async(req, res) => {
    try {
        const data = req.body;
        const result = await bookCollections.insertOne(data);
        res.send(result);
    } catch (error) {
        console.error('Upload book error:', error);
        res.status(500).json({ error: 'Failed to upload book' });
    }
});

//update a book data
app.patch("/book/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const updateBookData = req.body;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
            $set: {
                ...updateBookData
            }
        }
        const options = {upsert: true};
        const result = await bookCollections.updateOne(filter, updatedDoc ,options);
        res.send(result);
    } catch (error) {
        console.error('Update book error:', error);
        res.status(500).json({ error: 'Failed to update book' });
    }
});

//delete a book data
app.delete("/book/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id)};
        const result = await bookCollections.deleteOne(filter);
        res.send(result);
    } catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// filter data - GET all books
app.get("/all-books", async(req, res) => {
    try {
        let query = {};
        if(req.query?.category){
            query = {category: req.query.category};
        }
        const result = await bookCollections.find(query).toArray();
        res.send(result);
    } catch (error) {
        console.error('Get all books error:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// get single book data
app.get("/book/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id)};
        const result = await bookCollections.findOne(filter);
        
        // Track view count
        if (result) {
            await bookCollections.updateOne(
                filter,
                { 
                    $inc: { views: 1 },
                    $set: { lastViewed: new Date() }
                }
            );
        }
        
        res.send(result);
    } catch (error) {
        console.error('Get single book error:', error);
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});

// Rate a book
app.post("/book/:id/rate", async(req, res) => {
    try {
        const id = req.params.id;
        const { rating, userId } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).send({ error: 'Rating must be between 1 and 5' });
        }

        const filter = { _id: new ObjectId(id) };
        const book = await bookCollections.findOne(filter);
        
        if (!book) {
            return res.status(404).send({ error: 'Book not found' });
        }

        // Calculate new average rating
        const currentRating = book.rating || 0;
        const currentTotal = book.totalRatings || 0;
        const newTotal = currentTotal + 1;
        const newAverage = ((currentRating * currentTotal) + rating) / newTotal;

        const updatedDoc = {
            $set: {
                rating: newAverage,
                totalRatings: newTotal,
                lastRated: new Date()
            }
        };

        await bookCollections.updateOne(filter, updatedDoc);
        
        // Track user rating activity
        if (userId) {
            await analyticsCollections.insertOne({
                type: 'rating',
                bookId: id,
                userId: userId,
                rating: rating,
                timestamp: new Date()
            });
        }
        
        res.send({
            success: true,
            averageRating: newAverage,
            totalRatings: newTotal
        });
    } catch (error) {
        console.error('Rating error:', error);
        res.status(500).send({ error: 'Failed to rate book' });
    }
});

// Get most popular books (by views and ratings)
app.get("/popular-books", async(req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        // Get books sorted by views and ratings
        const popularBooks = await bookCollections
            .find()
            .sort({ views: -1, totalRatings: -1, rating: -1 })
            .limit(limit)
            .toArray();
        
        res.send(popularBooks);
    } catch (error) {
        console.error('Error fetching popular books:', error);
        res.status(500).send({ error: 'Failed to fetch popular books' });
    }
});

// Save or update user info when they login
app.post("/user/login", async(req, res) => {
    try {
        const { uid, email, displayName, photoURL, adminKey } = req.body;
        
        if (!uid) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        const filter = { uid: uid };
        
        // Check if user already exists to preserve role
        const existingUser = await userCollections.findOne(filter);
        
        // Determine role based on admin key
        let userRole = 'user';
        if (adminKey && adminKey === process.env.ADMIN_SECRET_KEY) {
            userRole = 'admin';
        } else if (existingUser && existingUser.role) {
            // Preserve existing role if no admin key provided
            userRole = existingUser.role;
        }
        
        const updateDoc = {
            $set: {
                email: email,
                displayName: displayName || email.split('@')[0],
                photoURL: photoURL,
                lastLogin: new Date(),
                role: userRole
            },
            $setOnInsert: {
                createdAt: new Date()
            }
        };

        const result = await userCollections.updateOne(
            filter,
            updateDoc,
            { upsert: true }
        );
        
        // Get updated user with role
        const user = await userCollections.findOne(filter);
        
        res.send({ success: true, user, result });
    } catch (error) {
        console.error('User login error:', error);
        res.status(500).send({ error: 'Failed to save user data' });
    }
});

// Update user role (admin only)
app.patch("/user/:uid/role", async(req, res) => {
    try {
        const { uid } = req.params;
        const { role, adminUid } = req.body;
        
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).send({ error: 'Invalid role' });
        }

        // Verify admin making request
        const admin = await userCollections.findOne({ uid: adminUid });
        if (!admin || admin.role !== 'admin') {
            return res.status(403).send({ error: 'Unauthorized: Admin access required' });
        }

        const result = await userCollections.updateOne(
            { uid: uid },
            { $set: { role: role, updatedAt: new Date() } }
        );
        
        res.send({ success: true, result });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send({ error: 'Failed to update user role' });
    }
});

// Get all users
app.get("/users", async(req, res) => {
    try {
        const users = await userCollections
            .find()
            .sort({ lastLogin: -1 })
            .toArray();
        
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ error: 'Failed to fetch users' });
    }
});

// Get dashboard analytics
app.get("/analytics/dashboard", async(req, res) => {
    try {
        // Get all books for calculations
        const allBooks = await bookCollections.find().toArray();
        
        // Total books
        const totalBooks = allBooks.length;
        
        // Total users
        const totalUsers = await userCollections.countDocuments();
        
        // Books with ratings
        const booksWithRatings = allBooks.filter(book => book.totalRatings > 0);
        
        const totalRatings = booksWithRatings.reduce((sum, book) => 
            sum + (book.totalRatings || 0), 0
        );
        
        const avgRating = booksWithRatings.length > 0
            ? booksWithRatings.reduce((sum, book) => 
                sum + (book.rating || 0), 0) / booksWithRatings.length
            : 0;
        
        // Categories count
        const categories = await bookCollections.distinct("category");
        
        // Total views
        const totalViews = allBooks.reduce((sum, book) => 
            sum + (book.views || 0), 0
        );
        
        // Price calculations
        const totalValue = allBooks.reduce((sum, book) => 
            sum + parseFloat(book.price || 0), 0
        );
        
        const avgPrice = totalBooks > 0 ? totalValue / totalBooks : 0;
        
        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentUsers = await userCollections.countDocuments({
            lastLogin: { $gte: sevenDaysAgo }
        });
        
        res.send({
            totalBooks,
            totalUsers,
            totalRatings,
            avgRating: avgRating.toFixed(2),
            categories: categories.length,
            totalViews,
            activeUsers: recentUsers,
            totalValue: Math.round(totalValue),
            avgPrice: Math.round(avgPrice)
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).send({ error: 'Failed to fetch analytics' });
    }
});

// Initialize database connection on startup
connectToDatabase();

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Example app is listening on port ${port}`);
    });
}

// Export for Vercel serverless
module.exports = app;