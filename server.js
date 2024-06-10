// server.js

import express from 'express';
import connectDB from './db.js'; // Import fungsi koneksi MongoDB
import cors from 'cors';
import tourismRoutes from './route.js';
import dotenv from 'dotenv';
import auth from './auth.js'
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/tourism", tourismRoutes);
app.use("/auth", auth)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});