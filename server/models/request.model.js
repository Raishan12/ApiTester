import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  url: { type: String, required: true },
  method: { type: String, required: true },
  headers: [{ key: String, value: String }],
  params: [{ key: String, value: String }],
  body: mongoose.Schema.Types.Mixed,
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Request", requestSchema);
