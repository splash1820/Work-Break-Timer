let interval;

self.onmessage = (message) => {
    const { action, duration } = message.data;

    if (action === 'start') {
        const endTime = Date.now() + duration * 1000;
        interval = setInterval(() => {
            const remaining = Math.max(Math.round((endTime - Date.now()) / 1000), 0);
            postMessage(remaining);
            if (remaining <= 0) clearInterval(interval);
        }, 1000);
    } else if (action === 'stop') {
        clearInterval(interval);
    }
};
