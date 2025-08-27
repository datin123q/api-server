import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors()); // cho phép gọi API từ frontend (GitHub Pages, localhost, ...)
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb+srv://todoApp:1@cluster0.v5aaw6i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let collection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("todoApp");        // database name
    collection = db.collection("todolists"); // collection name
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connect error:", err);
  }
}
connectDB();


// ========== Routes ==========

// GET all todos
app.get("/todolists", async (req, res) => {
  const todos = await collection.find().toArray();
  res.json(todos);
});

// POST add todo
app.post("/todolists", async (req, res) => {
  const newTodo = req.body;
  const result = await collection.insertOne(newTodo);
  res.json({ ...newTodo, _id: result.insertedId });
});

// PUT update todo (full update)
app.put("/todolists/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  res.json({ message: "Updated" });
});

// PATCH update done status
app.patch("/todolists/:id", async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: { done } });
  res.json({ message: "Done toggled" });
});

// DELETE todo
app.delete("/todolists/:id", async (req, res) => {
  const { id } = req.params;
  await collection.deleteOne({ _id: new ObjectId(id) });
  res.json({ message: "Deleted" });
});

// root test
app.get("/", (req, res) => {
  res.send("Todo API running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
