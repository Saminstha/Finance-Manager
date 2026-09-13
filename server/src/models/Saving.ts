import mongoose, { Schema } from "mongoose";

interface ISaving {
  userId: mongoose.Types.ObjectId;
  title: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const savingSchema = new Schema<ISaving>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    savedAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    deadline: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

savingSchema.index({ userId: 1, createdAt: -1 });

export const Saving = mongoose.model<ISaving>("Saving", savingSchema);
