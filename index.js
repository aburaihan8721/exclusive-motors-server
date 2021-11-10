// imported modules
const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");

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

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
  try {
    await client.connect();
    console.log("database connected successfully");

    // create a document to insert
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// initial get
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Basic url
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
