const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://dbuser1:8RTUsulaw9n4frzB@cluster0.iryagpj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const usersCollection = client.db("userExpress").collection('user');

        // POST user: add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        });

        // get users: 
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = usersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // Delete a user
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        });

        // get a user
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.findOne(query);
            res.send(result);
        });

        // update user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = req.body;
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
            const result = await usersCollection.updateOne(query, updatedDoc, options);
            res.send(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running my node CRUD server');
})

app.listen(port, () => {
    console.log('listening on port', port)
})