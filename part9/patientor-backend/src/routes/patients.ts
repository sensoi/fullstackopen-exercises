import express from "express";
import patientService from "../services/patientService";
import toNewPatient, { toNewEntry } from "../utils";

const router = express.Router();

// ✅ FIX: ensure body is parsed for this router
router.use(express.json());

// GET /api/patients
router.get("/", (_req, res) => {
  res.json(patientService.getPatients());
});

// GET /api/patients/:id
router.get("/:id", (req, res) => {
  const patient = patientService.findById(req.params.id);

  if (!patient) {
    res.status(404).send("Patient not found");
    return;
  }

  res.json(patient);
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

// POST /api/patients/:id/entries
router.post("/:id/entries", (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(req.params.id, newEntry);
    res.json(addedEntry);
  } catch (e: unknown) {
    let errorMessage = "Something went wrong.";
    if (e instanceof Error) {
      errorMessage += " " + e.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
