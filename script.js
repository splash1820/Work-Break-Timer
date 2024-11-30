let workTime = 0;
let breakTime = 0;
let endTime = null;
let isWorkTime = true;
let sessionCount = 0;
let timer;

function startTimer() {
    const workInput = document.getElementById("workTime").value;
    const breakInput = document.getElementById("breakTime").value;

    if (!workInput || !breakInput || workInput <= 0 || breakInput <= 0) {
        alert("Please enter valid work and break times.");
        return;
    }

    workTime = parseInt(workInput) * 60; // Convert minutes to seconds
    breakTime = parseInt(breakInput) * 60;
    sessionCount = 0;

    if (!timer) {
        endTime = Date.now() + workTime * 1000;
        runTimer();
    }
}

function runTimer() {
    const display = document.getElementById("timerDisplay");
    const statusDisplay = document.getElementById("statusDisplay");
    const sessionDisplay = document.getElementById("sessionCount");

    function updateTimer() {
        const now = Date.now();
        const secondsLeft = Math.max(Math.round((endTime - now) / 1000), 0);

        const minutes = Math.floor(secondsLeft / 60);
        const remainingSeconds = secondsLeft % 60;
        display.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

        if (secondsLeft <= 0) {
            clearInterval(timer);
            playAlarm();

            // Toggle between work and break time
            if (isWorkTime) {
                sessionCount++;
                sessionDisplay.textContent = sessionCount;
                endTime = Date.now() + breakTime * 1000;
            } else {
                endTime = Date.now() + workTime * 1000;
            }

            isWorkTime = !isWorkTime;

            // Update status
            statusDisplay.textContent = isWorkTime ? "Status: Working Time" : "Status: Break Time";

            runTimer(); // Start the next cycle
        }
    }

    // Update status display at the start
    statusDisplay.textContent = isWorkTime ? "Status: Working Time" : "Status: Break Time";

    // Start the interval
    timer = setInterval(updateTimer, 1000);

    // Run the update immediately to avoid a delay
    updateTimer();
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
