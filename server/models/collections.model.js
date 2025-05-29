import mongoose from "mongoose"

const collectionSchema = new mongoose.Schema({
    collectionname: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
})

export default mongoose.model.Collections || mongoose.model("Collection", collectionSchema)