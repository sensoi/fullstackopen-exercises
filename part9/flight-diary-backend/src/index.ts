import express from "express";
import cors from "cors";
import diaryRouter from "./routes/diaries.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.use("/api/diaries", diaryRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
