const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// const localIP = '192.168.1.110';
// const port = 3001;

// Connect to MongoDB Atlas
const uri = "mongodb+srv://umessgm:GNvC0ddomNceDF1E@cordova.itqab0i.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON request bodies
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.get('/', (req, res) => {
    // res.status(200).send({ message: 'Server is running!' });
    res.send('<p>Local Explorer Server is running!</p>');
});

// API endpoint to upload data to MongoDB Atlas
app.post('/uploadData', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('explorer_db');
        const collection = database.collection('explore');

        // Insert the data into the collection
        const result = await collection.insertMany(req.body);
        res.status(200).send({ message: 'Data uploaded successfully!', insertedCount: result.insertedCount, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to upload data!', success: false });
    }
});

// API endpoint to retrieve data from MongoDB Atlas
app.get('/getCloudData', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('explorer_db');
        const collection = database.collection('explore');

        // Find all documents in the collection
        const data = await collection.find({}).toArray();
        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to fetch cloud data!' });
    }
});

// Define an endpoint to delete all explore from the cloud database
app.delete('/deleteCloudData', async (req, res) => {
    try {
        // Connect to the MongoDB Atlas
        await client.connect();

        // Select the database and collection
        const db = client.db('explorer_db');
        const collection = db.collection('explore');

        // Delete all documents from the collection
        await collection.deleteMany({});

        res.status(200).send({ message: 'Cloud data deleted successfully!', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to delete cloud data!', success: false });
    } finally {
        // Close the connection to the MongoDB Atlas
        await client.close();
    }
});

// Start the Express server
app.listen();
