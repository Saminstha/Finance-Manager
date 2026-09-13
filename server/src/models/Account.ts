import mongoose, { Schema } from "mongoose";

export type AccountType = "cash" | "bank" | "wallet";

interface IAccount {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: AccountType;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["cash", "bank", "wallet"],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

accountSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Account = mongoose.model<IAccount>("Account", accountSchema);
