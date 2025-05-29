import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    foldername: {type: String, required: true, default: "New Folder"},
    Collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection", required: true }

})

export default mongoose.model.Folders || mongoose.model("Folder", folderSchema) 