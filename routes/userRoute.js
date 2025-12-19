import express from "express";
import { inscriptionUser, loginUser , deleteUser,getAllUsers , updateUser } from "../controllers/userController.js";
const userRouter = express.Router();
userRouter.post("/register", inscriptionUser);
userRouter.post("/login", loginUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/", getAllUsers);
export default userRouter;