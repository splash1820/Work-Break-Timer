let workTime = 0;
let breakTime = 0;
let isWorkTime = true;
let sessionCount = 0;

const worker = new Worker('timerWorker.js'); // Initialize Web Worker
let timerPaused = false; // Track if the timer is paused due to tab visibility

// Load preferences when the app starts
window.onload = () => {
    const savedWorkTime = localStorage.getItem('workTime');
    const savedBreakTime = localStorage.getItem('breakTime');

    if (savedWorkTime) {
        document.getElementById("workTime").value = savedWorkTime;
    }

    if (savedBreakTime) {
        document.getElementById("breakTime").value = savedBreakTime;
    }
};

function savePreferences() {
    const workInput = document.getElementById("workTime").value;
    const breakInput = document.getElementById("breakTime").value;

    if (workInput && breakInput && workInput > 0 && breakInput > 0) {
        localStorage.setItem('workTime', workInput);
        localStorage.setItem('breakTime', breakInput);
    }
}

function startTimer() {
    const workInput = document.getElementById("workTime").value;
    const breakInput = document.getElementById("breakTime").value;

    if (!workInput || !breakInput || workInput <= 0 || breakInput <= 0) {
        alert("Please enter valid work and break times.");
        return;
    }

    savePreferences(); // Save the user's preferences

    workTime = parseInt(workInput) * 60;
    breakTime = parseInt(breakInput) * 60;
    sessionCount = 0;

    startCountdown(workTime);
}

function startCountdown(seconds) {
    const display = document.getElementById("timerDisplay");
    const statusDisplay = document.getElementById("statusDisplay");
    const sessionDisplay = document.getElementById("sessionCount");

    statusDisplay.textContent = isWorkTime ? "Status: Working Time" : "Status: Break Time";

    worker.postMessage({ action: 'start', duration: seconds });

    worker.onmessage = (e) => {
        const remaining = e.data;
        if (remaining > 0) {
            const minutes = Math.floor(remaining / 60);
            const remainingSeconds = remaining % 60;
            display.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            playAlarm();
            toggleTimer();
        }
    };
}

function toggleTimer() {
    isWorkTime = !isWorkTime;
    const sessionDisplay = document.getElementById("sessionCount");
    if (!isWorkTime) sessionCount++;
    sessionDisplay.textContent = sessionCount;
    startCountdown(isWorkTime ? workTime : breakTime);
}

function stopTimer() {
    worker.postMessage({ action: 'stop' });
}

function resetTimer() {
    stopTimer();
    document.getElementById("timerDisplay").textContent = "00:00";
    document.getElementById("statusDisplay").textContent = "Status: Not Started";
    document.getElementById("sessionCount").textContent = 0;
    sessionCount = 0;
    isWorkTime = true;
}

function playAlarm() {
    const alarmSound = document.getElementById("alarmSound");
    alarmSound.play().catch(() => {
        alert("Unable to play alarm sound. Please enable audio in your browser.");
    });
}

// Handle Page Visibility API
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopTimer();
        timerPaused = true;
    } else if (timerPaused) {
        timerPaused = false;
        startTimer();
    }
});
