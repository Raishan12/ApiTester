import mongoose from "mongoose"

export default async function connection() {
    try {
        const db = await mongoose.connect("mongodb://localhost:27017/apitesterdb")
        console.log("DataBase Connected")
        return db
    } catch (error) {
        console.log("DataBase Connection Failed: ", error)
    }
}