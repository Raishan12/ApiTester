import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  foldername: { type: String, required: true },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true },
}, { timestamps: true });

export default mongoose.model("Folder", folderSchema);
