import express from "express"
import connection from "./connection.js"
import env from "dotenv"

env.config()

const PORT=process.env.PORT

const app = express()


connection().then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}).catch((error)=>console.log("Server connection Failed: ", error))