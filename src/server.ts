import express, { type Application, type Request, type Response } from "express";
import mongoose, { Schema, Document } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());


interface IItem extends Document {
  name: string;
  description: string;
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String }
});

const Item = mongoose.model<IItem>("Item", ItemSchema);


app.get("/items", async (_req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});

app.get("/items/:id", async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});

app.post("/items", async (req: Request, res: Response) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});

app.put("/items/:id", async (req: Request, res: Response) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});

app.delete("/items/:id", async (req: Request, res: Response) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});


const PORT = parseInt(process.env.PORT || "5000", 10);

app.get("/", async (req: Request, res: Response) => {
    res.send("API is running....");
  });
mongoose.connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

    console.log(`Server is accessible at http://localhost:${PORT}`);

  })
  .catch(err => console.error("MongoDB connection error:", err));
