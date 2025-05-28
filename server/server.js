import express from "express"
import connection from "./connection.js"
import env from "dotenv"
import apiRoutes from "./routes/api.routes.js"
import cors from "cors"

env.config()


const PORT=process.env.PORT

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api",apiRoutes)


connection().then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}).catch((error)=>console.log("Server connection Failed: ", error))