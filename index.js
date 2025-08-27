import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Atlas URI (thay username + password + db name của bạn vào đây)
const uri = "mongodb+srv://todoApp:1@cluster0.v5aaw6i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);
app.use(express.json());

// Lấy tất cả todos
app.get("/todolists", async (req, res) => {
  await client.connect();
  const todos = await client.db("todo_app").collection("todolists").find().toArray();
  res.json(todos);
});

// Thêm todo
app.post("/todolists", async (req, res) => {
  await client.connect();
  const result = await client.db("todo_app").collection("todolists").insertOne(req.body);
  res.json(result);
});

// Sửa todo
app.patch("/todolists/:id", async (req, res) => {
  await client.connect();
  const result = await client.db("todo_app").collection("todolists").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.json(result);
});

// Xóa todo
app.delete("/todolists/:id", async (req, res) => {
  await client.connect();
  const result = await client.db("todo_app").collection("todolists").deleteOne({
    _id: new ObjectId(req.params.id)
  });
  res.json(result);
});

app.listen(port, () => console.log(`✅ Server chạy ở http://localhost:${port}`));
