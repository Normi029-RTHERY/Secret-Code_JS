import { Controller } from "../app.js";

export class Timer {

    duration = null;
    running = false;
    timerDisplayEl = document.getElementById('timer');
    timeSpent = 0;

    constructor(_duration) {
        this.duration = _duration;
        this.updateDisplay(_duration);
    }

    start() {
        const startedAt = performance.now();
        this.running = true;

        const tick = () => {
            if (!this.running) return;
            this.timeSpent = performance.now() - startedAt;
            const timeLeft = this.duration - this.timeSpent;

            this.updateDisplay(timeLeft);

            if (timeLeft > 0) {
                requestAnimationFrame(tick);
            } else {
                this.running = false;
                Controller.lose();
            }
        };

        tick();

        return () => {
            this.running = false;
        };
    }

    updateDisplay(_timeLeft, _warningThreshold = 20000) {
        const timeLeft = Math.max(0, _timeLeft);
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        const milliseconds = Math.floor(timeLeft % 1000);
        this.timerDisplayEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;

        if (timeLeft > 0 && timeLeft < _warningThreshold) {
            let warningValue = timeLeft / _warningThreshold;
            this.flashWarning(timeLeft, warningValue);
        } else if (timeLeft === 0) {
            document.documentElement.style.setProperty('--timer-warning', 1);
        }
    }

    interval = 1000;
    lastFlashTime = null;

    flashWarning(_timeLeft, _warningValue) {
        if (this.lastFlashTime !== null && performance.now() - this.lastFlashTime >= Math.max((this.interval * _warningValue), 50)) {
            this.lastFlashTime = performance.now();
            if (document.documentElement.style.getPropertyValue('--timer-warning') == 1) {
                document.documentElement.style.setProperty('--timer-warning', 0);
            } else {
                document.documentElement.style.setProperty('--timer-warning', 1);
            }
        } else if (this.lastFlashTime === null) {
            document.documentElement.style.setProperty('--timer-warning', 1);
            this.lastFlashTime = performance.now();
        }

    }
}