import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE = path.join(__dirname, "..", "data", "streaks.json");

function loadData() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function dateKey(date) {
  return date.toISOString().split("T")[0];
}

export function updateStreak({ platform, username, solvedToday }) {
  const data = loadData();
  const key = `${platform}:${username}`;
  const today = dateKey(new Date());

  if (!data[key]) {
    data[key] = {
      streak: solvedToday ? 1 : 0,
      lastSolved: solvedToday ? today : null
    };
  } else if (solvedToday) {
    if (data[key].lastSolved !== today) {
      const yesterday = dateKey(
        new Date(Date.now() - 86400000)
      );

      data[key].streak =
        data[key].lastSolved === yesterday
          ? data[key].streak + 1
          : 1;

      data[key].lastSolved = today;
    }
  }

  saveData(data);
  return data[key];
}
