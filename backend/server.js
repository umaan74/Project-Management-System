import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db";

dotenv.config();
ConnectDB();
const app = express();
const port = process.env.SERVER_PORT;
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is listening on Port:${port}`);
});
