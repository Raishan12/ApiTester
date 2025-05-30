import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  collectionname: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("Collection", collectionSchema);
