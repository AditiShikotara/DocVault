import "dotenv/config";

import cors from "cors";
import dns from "dns";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "DocVault API is running",
  });
});

console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASSWORD:", process.env.MAIL_PASSWORD ? "loaded" : "MISSING");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});