import { useEffect, useState } from "react";
import axios from "axios";
import diaryService from "./services/dairyServices";
import type { DiaryEntry } from "./types";

const weatherOptions: DiaryEntry["weather"][] = [
  "sunny",
  "rainy",
  "cloudy",
  "stormy",
  "windy",
];

const visibilityOptions: DiaryEntry["visibility"][] = [
  "great",
  "good",
  "ok", 
  "poor",
];

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState<DiaryEntry["weather"]>("sunny");
  const [visibility, setVisibility] =
    useState<DiaryEntry["visibility"]>("good");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    diaryService.getAll().then(setDiaries);
  }, []);

  const addDiary = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newEntry = await diaryService.create({
        date,
        weather,
        visibility,
      });

      setDiaries(diaries.concat(newEntry));
      setDate("");
      setWeather("sunny");
      setVisibility("good");
      setError(null);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error || "unknown error");
      } else {
        setError("unexpected error");
      }
    }
  };

  return (
    <div>
      <h1>Flight Diaries</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <h2>Add new</h2>
      <form onSubmit={addDiary}>
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          weather
          {weatherOptions.map((w) => (
            <label key={w} style={{ marginLeft: 8 }}>
              <input
                type="radio"
                name="weather"
                checked={weather === w}
                onChange={() => setWeather(w)}
              />
              {w}
            </label>
          ))}
        </div>

        <div>
          visibility
          {visibilityOptions.map((v) => (
            <label key={v} style={{ marginLeft: 8 }}>
              <input
                type="radio"
                name="visibility"
                checked={visibility === v}
                onChange={() => setVisibility(v)}
              />
              {v}
            </label>
          ))}
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map((d) => (
        <div key={d.id}>
          <h3>{d.date}</h3>
          <div>weather: {d.weather}</div>
          <div>visibility: {d.visibility}</div>
        </div>
      ))}
    </div>
  );
};

export default App;
