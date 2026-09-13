import mongoose, { Schema } from "mongoose";

export type TransactionType = "income" | "expense";

interface ITransaction {
  userId: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

transactionSchema.index({ userId: 1, date: -1 });

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema,
);
