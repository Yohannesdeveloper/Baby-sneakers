const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, enum: ["men", "women", "kids"] },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// List products
app.get("/api/products", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create product
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, description, image, category } = req.body;
    if (!name || typeof price !== "number" || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const created = await Product.create({
      name,
      price,
      description,
      image,
      category,
    });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Create contact message
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const created = await Contact.create({ name, email, message });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Failed to create contact message" });
  }
});

const PORT = process.env.PORT || 5177;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  try {
    if (!MONGODB_URI) {
      console.error("Missing MONGODB_URI in environment");
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    app.listen(PORT, () =>
      console.log(`API listening on http://localhost:${PORT}`)
    );
  } catch (e) {
    console.error("Failed to start server", e);
    process.exit(1);
  }
}

start();
