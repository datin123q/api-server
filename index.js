import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Kết nối MongoDB Atlas
const uri = process.env.MONGO_URI || "mongodb+srv://todoApp:1@cluster0.v5aaw6i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = "todoApp";

app.get("/todolists", async (req, res) => {
  await client.connect();
  const todos = await client.db(dbName).collection("todolists").find().toArray();
  res.json(todos);
});

app.post("/todolists", async (req, res) => {
  await client.connect();
  const result = await client.db(dbName).collection("todolists").insertOne(req.body);
  res.json(result);
});

app.patch("/todolists/:id", async (req, res) => {
  await client.connect();
  const result = await client.db(dbName).collection("todolists")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
  res.json(result);
});

app.delete("/todolists/:id", async (req, res) => {
  await client.connect();
  const result = await client.db(dbName).collection("todolists")
    .deleteOne({ _id: new ObjectId(req.params.id) });
  res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("✅ Server running on port " + port));
