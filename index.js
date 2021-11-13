// imported modules
const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();

// port
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// ===========mongodb connection process=================
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kbl8m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("exclusiveMotors");
    console.log("database connected");
    // collection
    const carsCollection = database.collection("carsCollection");
    const reviewCollection = database.collection("reviewCollection");
    const addressCollection = database.collection("addressCollection");

    // ==================POST METHODS===========================
    // add cars data
    app.post("/cars", async (req, res) => {
      const car = req.body;
      const result = await carsCollection.insertOne(car);
      console.log(result);
      res.json(result);
    });

    // add review data
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });

    // add address data
    app.post("/address", async (req, res) => {
      const singleAddress = req.body;
      const result = await addressCollection.insertOne(singleAddress);
      console.log(result);
      res.json(result);
    });


    
    // ==================GET METHODS===========================
    // get all cars data
    app.get("/cars", async (req, res) => {
      const cursor = carsCollection.find({});
      const cars = await cursor.toArray();
      res.send(cars);
    });

    // get single cars data
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const car = await carsCollection.findOne(query);
      res.send(car);
    });

    // get all reviews data
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // get all address
    app.get("/address", async (req, res) => {
      const cursor = reviewCollection.find({});
      const address = await cursor.toArray();
      res.send(address);
    });



  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// initial get
app.get("/", (req, res) => {
  res.send("Hello World Server Successfully Connected!");
});
// Basic url
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// ==============end===============
