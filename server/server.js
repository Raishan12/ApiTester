import express from "express"
import connection from "./connection.js"
import env from "dotenv"
import apiRoutes from "./routes/api.routes.js"
import cors from "cors"
import path from 'path'
import url from "url"

env.config()
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT=process.env.PORT

const app = express()
app.use(express.json())
app.use(cors())

app.use("/images",express.static(path.join(__dirname, "images")))
console.log(path.join(__dirname, "images"))
app.use("/api",apiRoutes)


connection().then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}).catch((error)=>console.log("Server connection Failed: ", error))