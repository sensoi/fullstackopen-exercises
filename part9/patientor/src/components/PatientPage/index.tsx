import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Stack
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";

import patientService from "../../services/patients";
import {
  Patient,
  Entry,
  Diagnosis,
  HealthCheckRating
} from "../../types";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryDetails = ({
  entry,
  diagnoses
}: {
  entry: Entry;
  diagnoses?: Diagnosis[];
}) => {
  const diagnosisName = (code: string) =>
    diagnoses?.find(d => d.code === code)?.name;

  const DiagnosisList = () =>
    entry.diagnosisCodes ? (
      <ul>
        {entry.diagnosisCodes.map(code => (
          <li key={code}>
            {code} {diagnosisName(code)}
          </li>
        ))}
      </ul>
    ) : null;

  switch (entry.type) {
    case "HealthCheck":
      return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography>
            {entry.date} <FavoriteIcon /> {entry.description}
          </Typography>
          <DiagnosisList />
          <Typography>health rating: {entry.healthCheckRating}</Typography>
        </Paper>
      );
    case "Hospital":
      return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography>
            {entry.date} <LocalHospitalIcon /> {entry.description}
          </Typography>
          <DiagnosisList />
          <Typography>
            discharge: {entry.discharge.date} ({entry.discharge.criteria})
          </Typography>
        </Paper>
      );
    case "OccupationalHealthcare":
      return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography>
            {entry.date} <WorkIcon /> {entry.description}
          </Typography>
          <DiagnosisList />
          <Typography>employer: {entry.employerName}</Typography>
          {entry.sickLeave && (
            <Typography>
              sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
            </Typography>
          )}
        </Paper>
      );
    default:
      return assertNever(entry);
  }
};

const PatientPage = ({ diagnoses }: { diagnoses?: Diagnosis[] }) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

  // common
  const [type, setType] =
    useState<"HealthCheck" | "Hospital" | "OccupationalHealthcare">(
      "HealthCheck"
    );
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");

  // healthcheck
  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(HealthCheckRating.Healthy);

  // hospital
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // occupational
  const [employerName, setEmployerName] = useState("");
  const [sickStart, setSickStart] = useState("");
  const [sickEnd, setSickEnd] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      const data = await patientService.getById(id);
      setPatient(data);
    };
    void fetchPatient();
  }, [id]);

  const resetForm = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setHealthCheckRating(HealthCheckRating.Healthy);
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickStart("");
    setSickEnd("");
    setType("HealthCheck");
  };

  const submitEntry = async () => {
    if (!id) return;

    try {
      let entry: unknown;

      switch (type) {
        case "HealthCheck":
          entry = {
            type,
            description,
            date,
            specialist,
            healthCheckRating
          };
          break;
        case "Hospital":
          entry = {
            type,
            description,
            date,
            specialist,
            discharge: {
              date: dischargeDate,
              criteria: dischargeCriteria
            }
          };
          break;
        case "OccupationalHealthcare":
          entry = {
            type,
            description,
            date,
            specialist,
            employerName,
            sickLeave:
              sickStart && sickEnd
                ? { startDate: sickStart, endDate: sickEnd }
                : undefined
          };
          break;
        default:
          return assertNever(type);
      }

      await patientService.addEntry(id, entry);
      const updated = await patientService.getById(id);
      setPatient(updated);
      setError(null);
      resetForm();
    } catch {
      setError("Failed to add entry");
    }
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      <Typography variant="h5">{patient.name}</Typography>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      <Paper variant="outlined" sx={{ p: 2, mt: 3, mb: 3 }}>
        <Typography variant="h6">Add Entry</Typography>
        {error && <Typography color="error">{error}</Typography>}

        <Stack spacing={1}>
          <TextField
            select
            label="Type"
            value={type}
            onChange={e => setType(e.target.value as any)}
          >
            <MenuItem value="HealthCheck">HealthCheck</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">
              OccupationalHealthcare
            </MenuItem>
          </TextField>

          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <TextField
            label="Specialist"
            value={specialist}
            onChange={e => setSpecialist(e.target.value)}
          />

          {type === "HealthCheck" && (
            <TextField
              label="Health rating (0–3)"
              type="number"
              inputProps={{ min: 0, max: 3 }}
              value={healthCheckRating}
              onChange={e =>
                setHealthCheckRating(
                  Number(e.target.value) as HealthCheckRating
                )
              }
            />
          )}

          {type === "Hospital" && (
            <>
              <TextField
                label="Discharge date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dischargeDate}
                onChange={e => setDischargeDate(e.target.value)}
              />
              <TextField
                label="Discharge criteria"
                value={dischargeCriteria}
                onChange={e => setDischargeCriteria(e.target.value)}
              />
            </>
          )}

          {type === "OccupationalHealthcare" && (
            <>
              <TextField
                label="Employer name"
                value={employerName}
                onChange={e => setEmployerName(e.target.value)}
              />
              <TextField
                label="Sick leave start"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={sickStart}
                onChange={e => setSickStart(e.target.value)}
              />
              <TextField
                label="Sick leave end"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={sickEnd}
                onChange={e => setSickEnd(e.target.value)}
              />
            </>
          )}

          <Button variant="contained" onClick={submitEntry}>
            Add Entry
          </Button>
        </Stack>
      </Paper>

      <Typography variant="h6">Entries</Typography>
      {patient.entries.map(e => (
        <EntryDetails key={e.id} entry={e} diagnoses={diagnoses} />
      ))}
    </div>
  );
};

export default PatientPage;
