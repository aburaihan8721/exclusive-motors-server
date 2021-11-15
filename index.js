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
    const bookingCollection = database.collection("bookingCollection");

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

    // add booking data
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
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

    // get specific user's bookings
    app.get("/bookings", async (req, res) => {
      let query = {};
      const email = req.query.email;
      if (email) {
        query = { email: email };
      }
      const cursor = bookingCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    // get admin user
    app.get("/bookings/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const adminUser = await bookingCollection.findOne(query);
      let isAdmin = false;
      if (adminUser?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // ==================DELETE METHODS===========================

    // delete my orders/booking
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });

    // ==================PUT METHODS===========================
    app.put("/bookings/admin", async (req, res) => {
      const booking = req.body;
      console.log("put", booking);
      const filter = { email: booking.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await bookingCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// initial get
app.get("/", (req, res) => {
  res.send("Server Successfully Connected!");
});
// Basic url
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// ==============end===============
