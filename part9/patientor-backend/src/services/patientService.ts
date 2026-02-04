import patients from "../data/patientsData";
import { Patient, PublicPatient, NewPatient } from "../types";
import { v1 as uuid } from "uuid";

const getPatients = (): PublicPatient[] => {
  return patients.map((patient: Patient) => {
    const { ssn, ...rest } = patient;
    return rest;
  });
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  addPatient
};

