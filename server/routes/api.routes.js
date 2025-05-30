import express from "express"
import { addHistory, authsignup, changePassword, clearHistory, createCollection, createFolder, deleteCollection, deleteFolder, deleteUser, getCollections, getFolders, getHistory, getRequests, getuser, getUserDashboard, login, saveRequest, signup, updateUser } from "../controller/api.controller.js"
import auth from "../middleware/auth.js"

const apiRoutes = express.Router()

apiRoutes.post("/signup",signup)
apiRoutes.post("/authsignup",authsignup)
apiRoutes.post("/login",login)
apiRoutes.get("/getuser/:id",getuser)

apiRoutes.post("/collections", createCollection);
apiRoutes.get("/collections/:userId", getCollections);

apiRoutes.post("/folders", createFolder);
apiRoutes.get("/folders/:collectionId", getFolders);

apiRoutes.post("/requests",auth, saveRequest);
apiRoutes.get("/requests/:folderId",auth, getRequests);

apiRoutes.post("/history", addHistory);
apiRoutes.get("/history/:userId", getHistory);

apiRoutes.get("/user/dashboard", auth, getUserDashboard);

apiRoutes.put("/users/:id", auth, updateUser);

apiRoutes.post("/users/change-password", auth, changePassword);

apiRoutes.delete("/users/:id", auth, deleteUser);

apiRoutes.delete("/collections/:id", auth, deleteCollection);

apiRoutes.delete("/folders/:id", auth, deleteFolder);

apiRoutes.delete("/history/:userId", auth, clearHistory);


export default apiRoutes