import express from 'express';
import { Login, Register } from '../controllers/auth.controller.js';

const authRouter=express.Router();

authRouter.post("/register",Register)
authRouter.post("/login",Login)
// authRouter.post("/refresh",)
// authRouter.post("/logout",)
// authRouter.post("/logout-all",)

export default authRouter;