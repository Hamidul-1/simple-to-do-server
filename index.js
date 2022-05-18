const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://to_do:DOPlNc5IeN2tTcEr@cluster0.fyefn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const todoCollection = client.db('todoapp').collection('todo');
        // get todos
        app.get('/todo', async (req, res) => {
            const query = {}
            const cursor = todoCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        });
        // single details
        app.get('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventory = await todoCollection.findOne(query);
            res.send(inventory);

        })

        // post one inventory item
        app.post('/todo', async (req, res) => {
            const newTodo = req.body;
            const result = await todoCollection.insertOne(newTodo);
            res.send(result);
        })

        // delete inventory
        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(query);
            res.send(result)
        })


    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello to do app!')
})

app.listen(port, () => {
    console.log(`To do app listening on port ${port}`)
})