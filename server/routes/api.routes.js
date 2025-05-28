import express from "express"
import { getuser, login, signup } from "../controller/api.controller.js"

const apiRoutes = express.Router()

apiRoutes.post("/signup",signup)
apiRoutes.post("/login",login)
apiRoutes.get("/getuser/:id",getuser)


export default apiRoutes