const API_URL = "https://conclude-portuguese-dental-cabinet.trycloudflare.com/data";
const stintsGroup = document.getElementById("stints");
let lastTime = 0;

// Optional: Create a connection status banner
const timerBanner = document.getElementById("lastUpdate");
const statusBanner = document.getElementById("statusBanner");
const sendData = document.getElementById("sentData");
//document.body.insertBefore(statusBanner, stintsGroup);

async function fetchData() {
  try {
    const response = await fetch(API_URL, { cache: "no-store" });

    if (!response.ok) throw new Error("Server returned error");

    const result = await response.json();
    if (result === null) {
        console.error("Error fetching data");
        updateStatus(false);
        stintsGroup.textContent = "Unable to load data.";
        return;
    }
    console.log(result)
    console.log(result.driverAppdata.currentSetLength);
    sendData.textContent = JSON.stringify(result, null, 2);
    updateStatus(true);
    setTextForUI(result.telemetry["Graphics"]["session"], result.driverAppdata);

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
function setTextForUI(sessionType, appdata) {
    const isPractice = sessionType === 0;
    const isRace = sessionType === 2;
  
    // Show/hide depending on the session
    setVisibility("currentMode", true, `mode:${appdata.currentMode}`);
    setVisibility("currentSetLengthInput", isPractice, `${appdata.currentSetLength} race length`);
    setVisibility("currentStintPlan", isPractice, `${appdata.currentStintPlan}`);
    setVisibility("currentLongpitsLeft", true, `long pits left: ${appdata.currentLapsToPitDelta}`);
    setVisibility("currentPitstopsDelta", true, `edit pit cound by: ${appdata.currentPitstopsDelta}`);
    setVisibility("currentWarnings", true, `${appdata.currentWarnings}`);
    setVisibility("currentLapsToPit", isRace, `${appdata.currentLapsToPit}`);
    setVisibility("currentLapsToPitDelta", isRace, `+ ${appdata.currentLapsToPitDelta} laps`);
    setVisibility("currentLitersToAdd", isRace, `add ${appdata.currentLitersToAdd}l`);
    setVisibility("currentFuelTargetAndCurrent", isRace, `fuel target <${appdata.currentFuelTargetAndCurrent[0]}l/lap, current ${appdata.currentFuelTargetAndCurrent[1]}`);
    setVisibility("currentNextStop", isRace, `${appdata.currentNextStop}`);
  }
  
  function setVisibility(id, show, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = show ? "block" : "none";
    el.textContent = text;
  }

setInterval(fetchData, 1000);
setInterval(updateTimer, 100);
fetchData();
