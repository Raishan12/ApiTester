import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  url: String,
  method: String,
  statusCode: Number,
  responseTime: Number,
  responseData: mongoose.Schema.Types.Mixed,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("History", historySchema);
