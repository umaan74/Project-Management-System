import express from 'express';
import { Login, Logout, LogoutAll, Refresh, Register } from '../controllers/auth.controller.js';

const authRouter=express.Router();

authRouter.post("/register",Register)
authRouter.post("/login",Login)
authRouter.post("/refresh",Refresh)
authRouter.post("/logout",Logout)
authRouter.post("/logout-all",LogoutAll)

export default authRouter;