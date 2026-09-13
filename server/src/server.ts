import "dotenv/config";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/mongoose";

import authRoutes from "./auth/authRoutes";
import userRoutes from "./routes/users";
import accountRoutes from "./routes/accounts";
import transactionRoutes from "./routes/transactions";
import budgetRoutes from "./routes/budgets";
import savingRoutes from "./routes/savings";
import dashboardRoutes from "./dashboard/dashboardRoutes";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(requestLogger);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Finance Manager API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/savings", savingRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on "http://localhost:${PORT}"`);
  });
});
