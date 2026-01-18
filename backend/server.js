import express from "express";
import cors from "cors";

import { getLatestCFSubmission } from "./services/codeforces.js";
import { getLatestLeetCodeSubmission } from "./services/leetcode.js";
import { isToday } from "./utils/date.js";
import { updateStreak } from "./utils/streak.js";

const app = express();
app.use(cors());

app.get("/check", async (req, res) => {
  const { platform, username } = req.query;

  if (!platform || !username) {
    return res.status(400).json({ error: "platform and username required" });
  }

  try {
    let submissionDate;

    if (platform === "codeforces") {
      submissionDate = await getLatestCFSubmission(username);
    } else if (platform === "leetcode") {
      submissionDate = await getLatestLeetCodeSubmission(username);
    } else {
      return res.status(400).json({ error: "Unsupported platform" });
    }

    const solvedToday = isToday(submissionDate);

    const streakData = updateStreak({
      platform,
      username,
      solvedToday
    });

    res.json({
      solvedToday,
      streak: streakData.streak,
      lastSolved: streakData.lastSolved
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("CODEFORCES SERVICE LOADED - NEW VERSION");
  console.log(`Backend running on port ${PORT}`);
});

