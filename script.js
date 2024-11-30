let workTime = 0;
let breakTime = 0;
let timer;
let isWorkTime = true;
let sessionCount = 0;
let startTime;
let lastActiveTime; // To track navigation
let remainingTime = 0;

function startTimer() {
    const workInput = document.getElementById("workTime").value;
    const breakInput = document.getElementById("breakTime").value;

    if (!workInput || !breakInput || workInput <= 0 || breakInput <= 0) {
        alert("Please enter valid work and break times.");
        return;
    }

    workTime = parseInt(workInput) * 60;
    breakTime = parseInt(breakInput) * 60;
    remainingTime = workTime;
    sessionCount = 0;

    isWorkTime = true;
    startTime = Date.now();
    lastActiveTime = startTime;

    if (!timer) {
        startCountdown();
    }
}

function startCountdown() {
    const display = document.getElementById("timerDisplay");
    const statusDisplay = document.getElementById("statusDisplay");
    const sessionDisplay = document.getElementById("sessionCount");

    function updateTimer() {
        const now = Date.now();
        const elapsed = Math.floor((now - lastActiveTime) / 1000);

        remainingTime -= elapsed; // Deduct elapsed time
        lastActiveTime = now; // Update last active time

        if (remainingTime <= 0) {
            clearInterval(timer);
            playAlarm();

            // Switch between work and break time
            if (isWorkTime) {
                sessionCount++;
                sessionDisplay.textContent = sessionCount;
                remainingTime = breakTime;
            } else {
                remainingTime = workTime;
            }

            isWorkTime = !isWorkTime;
            statusDisplay.textContent = isWorkTime ? "Status: Working Time" : "Status: Break Time";

            startCountdown(); // Start the next phase
        } else {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            requestAnimationFrame(updateTimer); // Sync with the browser's repaint cycle
        }
    }

    timer = true; // Set timer active
    requestAnimationFrame(updateTimer);
}

function stopTimer() {
    timer = null;
    clearInterval(timer);
}

function resetTimer() {
    stopTimer();
    remainingTime = 0;
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

// Page Visibility API
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        // Save the current state when tab is inactive
        localStorage.setItem("lastActiveTime", Date.now());
        localStorage.setItem("remainingTime", remainingTime);
        localStorage.setItem("isWorkTime", isWorkTime);
    } else {
        // Resume when tab is active again
        const lastTime = localStorage.getItem("lastActiveTime");
        const savedRemainingTime = localStorage.getItem("remainingTime");
        const savedIsWorkTime = localStorage.getItem("isWorkTime");

        if (lastTime) {
            const elapsed = Math.floor((Date.now() - lastTime) / 1000);
            remainingTime = Math.max(0, savedRemainingTime - elapsed); // Update remaining time
            isWorkTime = savedIsWorkTime === "true";
        }
    }
});
