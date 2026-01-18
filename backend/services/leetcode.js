import fetch from "node-fetch";

/**
 * Returns Date of latest accepted LeetCode submission
 */
export async function getLatestLeetCodeSubmission(username) {
  const query = `
    query {
      recentSubmissionList(username: "${username}", limit: 1) {
        timestamp
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  const json = await response.json();

  if (!json.data || !json.data.recentSubmissionList.length) {
    throw new Error("No submissions found on LeetCode");
  }

  return new Date(json.data.recentSubmissionList[0].timestamp * 1000);
}
