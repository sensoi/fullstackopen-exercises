import express from "express";
import patientService from "../services/patientService";
import toNewPatient from "../utils";

const router = express.Router();

// GET /api/patients
router.get("/", (_req, res) => {
  res.json(patientService.getPatients());
});

// POST /api/patients
router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (e: unknown) {
    let errorMessage = "Something went wrong.";
    if (e instanceof Error) {
      errorMessage += " " + e.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
