let is24Hour = true;
let wakeLock = null;
let hideTimeout;

// Update clock
function updateClock() {
  let now = new Date();

  let hours = now.getHours();
  let minutes = String(now.getMinutes()).padStart(2, '0');
  let seconds = String(now.getSeconds()).padStart(2, '0');
  let ampm = "";

  if (!is24Hour) {
    ampm = hours >= 12 ? " PM" : " AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
  }

  hours = String(hours).padStart(2, '0');
  document.getElementById('clock').textContent =
    `${hours}:${minutes}:${seconds}${ampm}`;

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  document.getElementById('date').textContent =
    `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

// Format switch
document.getElementById('formatSwitch').addEventListener('change', (e) => {
  is24Hour = !e.target.checked ? true : false;
  document.getElementById('formatLabel').textContent = is24Hour ? "24-hour" : "12-hour";
  updateClock();
});

// Fullscreen button
document.getElementById('fsBtn').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.getElementById('fsBtn').textContent = "❎";
  } else {
    document.exitFullscreen();
    document.getElementById('fsBtn').textContent = "⛶";
  }
});
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    document.getElementById('fsBtn').textContent = "⛶";
  }
});

// Keep awake
document.getElementById('wakeSwitch').addEventListener('change', async (e) => {
  if (e.target.checked) {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      document.getElementById('wakeLabel').textContent = "Keep Awake ON";
      wakeLock.addEventListener("release", () => {
        document.getElementById('wakeSwitch').checked = false;
        document.getElementById('wakeLabel').textContent = "Keep Awake OFF";
        wakeLock = null;
      });
    } catch (err) {
      alert("Wake Lock not supported in this browser");
      e.target.checked = false;
    }
  } else {
    if (wakeLock) {
      wakeLock.release();
      wakeLock = null;
    }
    document.getElementById('wakeLabel').textContent = "Keep Awake OFF";
  }
});

// 🔥 Navbar + Cursor auto-hide
function showUI() {
  document.getElementById("navbar").classList.remove("hidden");
  document.body.style.cursor = "default";

  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    document.getElementById("navbar").classList.add("hidden");
    document.body.style.cursor = "none";
  }, 3000); // hide after 3s idle
}

document.addEventListener("mousemove", showUI);
showUI(); // run once at start

// Run clock
setInterval(updateClock, 1000);
updateClock();
