console.log("CODEFORCES SERVICE LOADED - NEW VERSION");

import fetch from "node-fetch";

export async function getLatestCFSubmission(username) {
  const res = await fetch(
    `https://codeforces.com/api/user.status?handle=${username}&from=1&count=20`
  );

  const data = await res.json();

  if (data.status !== "OK") {
    throw new Error("Codeforces API error");
  }

  const accepted = data.result.find(
    sub => sub.verdict === "OK"
  );

  if (!accepted) {
    throw new Error("No accepted submissions found");
  }

  return new Date(accepted.creationTimeSeconds * 1000);
}
