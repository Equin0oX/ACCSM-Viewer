async function fetchData() {
    try {
      const response = await fetch("https://suspension-speech-consider-producer.trycloudflare.com/data");
      const result = await response.json();
  
      const container = document.getElementById("container");
      container.innerHTML = ""; // Clear old data
  
      if (!result.stints || result.stints.length === 0) {
        container.textContent = "No data yet.";
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
        container.appendChild(div);
      });
  
    } catch (err) {
      document.getElementById("container").textContent = "Error loading data.";
      console.error(err);
    }
  }
  
  setInterval(fetchData, 1000);
  fetchData();
  