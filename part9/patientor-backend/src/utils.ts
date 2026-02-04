import { z } from "zod";
import { Gender } from "./types";

const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

const toNewPatient = (object: unknown) => {
  return NewPatientSchema.parse(object);
};

export default toNewPatient;
