import { diaries } from "../data/diaries.js";
import type { DiaryEntry, NewDiaryEntry } from "../types.js";

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const addEntry = (entry: NewDiaryEntry): DiaryEntry => {
  const newEntry: DiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    ...entry,
  };

  diaries.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  addEntry,
};
