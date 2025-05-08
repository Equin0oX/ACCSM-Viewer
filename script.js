const API_URL = "https://implies-plus-township-previews.trycloudflare.com/data";
const stintsGroup = document.getElementById("stints");
let lastTime = 0;

// Optional: Create a connection status banner
const timerBanner = document.getElementById("lastUpdate");
const statusBanner = document.getElementById("statusBanner");
document.body.insertBefore(statusBanner, stintsGroup);

async function fetchData() {
  try {
    const response = await fetch(API_URL, { cache: "no-store" });

    if (!response.ok) throw new Error("Server returned error");

    const result = await response.json();
    updateStatus(true);

    stintsGroup.innerHTML = "";

    lastTime = result.lastTime;

    if (!result.stints || result.stints.length === 0) {
      stintsGroup.textContent = "No data yet.";
      return;
    }

    result.stints.forEach((stint, index) => {
      const [laps, fuel, stopTime] = stint;

      const div = document.createElement("div");
      div.className = "box";
      div.innerHTML = `
        <div><span class="label">Stint #${index + 1}</span></div>
        <div>Laps: ${laps}</div>
        <div>Fuel: ${fuel} L</div>
        <div>Pit Stop Time: ${Math.round(stopTime / 1000)} s</div>
      `;
      stintsGroup.appendChild(div);
    });

  } catch (err) {
    updateStatus(false);
    stintsGroup.textContent = "Unable to load data.";
    console.error("Fetch error:", err);
  }
}
function updateTimer() {
    const now = new Date().getTime();
    const elapsed = ((now/1000 - lastTime));
    timerBanner.textContent = `Last update: ${elapsed.toFixed(1)} seconds ago`;

    timerBanner.style.background = "#f0f0f0";
    timerBanner.style.color = "#000000";

}
function updateStatus(connected) {
  if (connected) {
    statusBanner.textContent = "✅ Connected to server";
    statusBanner.style.background = "#d4edda";
    statusBanner.style.color = "#155724";
  } else {
    statusBanner.textContent = "❌ Not connected to server";
    statusBanner.style.background = "#f8d7da";
    statusBanner.style.color = "#721c24";
  }
}

setInterval(fetchData, 1000);
setInterval(updateTimer, 100);
fetchData();
