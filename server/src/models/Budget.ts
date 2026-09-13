import mongoose, { Schema } from "mongoose";

interface IBudget {
  userId: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
    },
  },
  { timestamps: true },
);

budgetSchema.index(
  { userId: 1, category: 1, month: 1, year: 1 },
  { unique: true },
);

export const Budget = mongoose.model<IBudget>("Budget", budgetSchema);
