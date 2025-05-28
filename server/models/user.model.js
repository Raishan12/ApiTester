import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    profilepicture: { type:String, default: null },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, default: null },
    status: { type: Boolean, default: false },
    auth0: { type: Boolean, default: false },
    otp: { type: Number, default: null }
})

export default mongoose.model.Users || mongoose.model("User", userSchema)