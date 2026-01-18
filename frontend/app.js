const API = "http://localhost:3000/check";

const usernameInput = document.getElementById("username");
const platformSelect = document.getElementById("platform");
const streakEl = document.getElementById("streak");
const statusEl = document.getElementById("status");
const checkBtn = document.getElementById("check");

checkBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const platform = platformSelect.value;

  console.log("USERNAME =", username);
  console.log("PLATFORM =", platform);

  if (!username || !platform) {
    statusEl.textContent = "Username or platform missing";
    return;
  }

  statusEl.textContent = "Checking...";

  try {
    const res = await fetch(
      `${API}?platform=${platform}&username=${username}`
    );
    const data = await res.json();

    if (data.error) {
      statusEl.textContent = data.error;
      return;
    }

    streakEl.textContent = `🔥 Streak: ${data.streak}`;
    statusEl.textContent = data.solvedToday
      ? "✅ Solved today"
      : "❌ Not solved today";
  } catch (err) {
    statusEl.textContent = "Backend not reachable";
  }
});
