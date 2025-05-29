import express from "express"
import { authsignup, getuser, login, signup } from "../controller/api.controller.js"

const apiRoutes = express.Router()

apiRoutes.post("/signup",signup)
apiRoutes.post("/authsignup",authsignup)
apiRoutes.post("/login",login)
apiRoutes.get("/getuser/:id",getuser)


export default apiRoutes