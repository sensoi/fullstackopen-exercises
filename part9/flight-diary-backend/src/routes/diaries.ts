import express from "express";
import diaryService from "../services/diaryService.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(diaryService.getEntries());
});

router.post("/", (req, res) => {
  const { date, weather, visibility } = req.body;

  if (!date || !weather || !visibility) {
    return res.status(400).json({
      error: "missing required fields",
    });
  }

  const newEntry = diaryService.addEntry({
    date,
    weather,
    visibility,
  });

  res.json(newEntry);
});

export default router;
