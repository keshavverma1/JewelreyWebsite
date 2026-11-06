
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    cached.promise = mongoose.connect(MONGO_URI);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// Database middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Basic route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PK Jewellery API is running",
  });
});

// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Export for Vercel
export default app;

