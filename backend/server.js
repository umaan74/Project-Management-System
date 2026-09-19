import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import dns from "dns";
import cookieParser from "cookie-parser";
import OrganRouter from "./routes/organization.routes.js";
import OrganMemberRouter from "./routes/organizationMember.routes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();
ConnectDB();

const app = express();
const port = process.env.SERVER_PORT;
app.use(express.json());
app.use(cookieParser());
app.use("/api/organizations", OrganRouter);
app.use("/api/auth", authRouter);
app.use("/api/organizations", OrganMemberRouter);
app.listen(port, () => {
  console.log(`Server is listening on Port:${port}`);
});
