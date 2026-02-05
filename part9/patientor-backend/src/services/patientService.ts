import patients from "../data/patientsData";
import {
  Patient,
  PublicPatient,
  NewPatient,
  Entry,
  NewEntry
} from "../types";
import { v1 as uuid } from "uuid";

const getPatients = (): PublicPatient[] => {
  return patients.map(({ ssn, ...rest }) => rest);
};

const findById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    entries: [],
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const patient = findById(patientId);

  if (!patient) {
    throw new Error("Patient not found");
  }

  const newEntry = {
    id: uuid(),
    ...entry
  } as Entry;

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  findById,
  addPatient,
  addEntry
};
