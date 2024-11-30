let workTime = 0;
let breakTime = 0;
let timer;
let isWorkTime = true;
let sessionCount = 0;

// Load saved preferences on page load
window.addEventListener("load", () => {
  const savedWorkTime = localStorage.getItem("workTime");
  const savedBreakTime = localStorage.getItem("breakTime");

  if (savedWorkTime) {
      document.getElementById("workTime").value = savedWorkTime;
  }
  if (savedBreakTime) {
      document.getElementById("breakTime").value = savedBreakTime;
  }
});

// Save preferences when user clicks "Start Timer"
function startTimer() {
  const workInput = document.getElementById("workTime").value;
  const breakInput = document.getElementById("breakTime").value;

  if (!workInput || !breakInput || workInput <= 0 || breakInput <= 0) {
      alert("Please enter valid work and break times.");
      return;
  }

  // Save to localStorage
  localStorage.setItem("workTime", workInput);
  localStorage.setItem("breakTime", breakInput);

  // Start the timer logic
  workTime = parseInt(workInput) * 60; // Convert minutes to seconds
  breakTime = parseInt(breakInput) * 60;
  sessionCount = 0;

  if (!timer) {
      startCountdown(workTime);
  }
}


function startCountdown(seconds) {
    const display = document.getElementById("timerDisplay");
    const statusDisplay = document.getElementById("statusDisplay");
    const sessionDisplay = document.getElementById("sessionCount");

    // Update the status to indicate whether it's work or break time
    statusDisplay.textContent = isWorkTime ? "Status: Working Time" : "Status: Break Time";

    timer = setInterval(() => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        display.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

        if (seconds === 0) {
            clearInterval(timer);
            playAlarm();

            // Toggle between work and break time
            if (isWorkTime) {
                sessionCount++;
                sessionDisplay.textContent = sessionCount;
                startCountdown(breakTime);
            } else {
                startCountdown(workTime);
            }

            isWorkTime = !isWorkTime;

            // Update status again after toggling
            statusDisplay.textContent = isWorkTime ? "Status: Working Time" : "Status: Break Time";
        } else {
            seconds--;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    stopTimer();
    document.getElementById("timerDisplay").textContent = "00:00";
    document.getElementById("sessionCount").textContent = 0;
    document.getElementById("statusDisplay").textContent = "Status: Not Started";
    sessionCount = 0;
}

function playAlarm() {
    const alarmSound = document.getElementById("alarmSound");
    alarmSound.play().catch(() => {
        alert("Unable to play alarm sound. Please enable audio in your browser.");
    });
}
