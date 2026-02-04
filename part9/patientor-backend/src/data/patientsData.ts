import { Patient, Gender } from "../types";
  
const patients: Patient[] = [
  {
    id: "d2773336-f723-11e9-8f0b-362b9e155667",
    name: "John McClane",
    dateOfBirth: "1986-07-09",
    ssn: "090786-122X",
    gender: Gender.Male,
    occupation: "New york city cop"
  },
  {
    id: "d2773598-f723-11e9-8f0b-362b9e155668",
    name: "Jane McClane",
    dateOfBirth: "1986-07-09",
    ssn: "090786-123X",
    gender: Gender.Female,
    occupation: "New york city cop"
  }
];

export default patients;
