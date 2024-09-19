import express from "express";
import cors from "cors";
import commentjs from "./src/controllers/commentFile.js";
import threadjs from "./src/controllers/threadFile.js";
import userjs from "./src/controllers/userFile.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/comment/", commentjs);
app.use("/thread/", threadjs);
app.use("/user/", userjs);

app.listen(3000, () => {
  console.log("express app started");
});
