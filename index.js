const express = require('express');
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('flower server project running')
})



const uri = `mongodb+srv://${process.env.db_name}:${process.env.db_pass}@cluster0.bqchovi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    const flowerProjectDb = client.db('FlowerDB').collection('flower')


    app.get('/flowers', async (req, res) => {
      const cursor = flowerProjectDb.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/flowers/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = {
        projection: { title: 1, img: 1 ,price: 1,service_id:1 },
      }
      const result = await flowerProjectDb.findOne(query ,options)
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`example app listening on port: ${port}`)
})