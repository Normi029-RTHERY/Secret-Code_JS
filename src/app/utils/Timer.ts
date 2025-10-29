import { GameState } from "../types/GameState";
import { Game } from "../../app.js";
import type { TimerUnits } from "../types/TimerUnits";

export class Timer {
    readonly duration: number;
    running = false;
    timeLeft: number;
    timeSpent = 0;
    inUnits: TimerUnits = {
        minutes: 0,
        seconds: 0,
        milliseconds: 0
    };
    private readonly timerDisplayEl = document.getElementById('timer-display') as HTMLElement;
    private readonly DOMStyle = document.documentElement.style;

    constructor(_duration: number) {
        this.duration = _duration;
        this.timeLeft = _duration;
        Game.state.effect(() => {
            this.running = (Game.state.get() === GameState.Playing);
            if (this.running) this.run();
        });
    }

    run() {
        const startedAt = performance.now();

        const tick = () => {
            if (!this.running) return;
            this.timeSpent = performance.now() - startedAt;
            this.timeLeft = this.duration - this.timeSpent;
            this.inUnits = {
                minutes: Math.floor(this.timeLeft / 60000),
                seconds: Math.floor((this.timeLeft % 60000) / 1000),
                milliseconds: Math.floor(this.timeLeft % 1000)
            };

            if (this.timeLeft > 0) {
                this.updateDisplay();
                requestAnimationFrame(tick);
            } else {
                Game.end();
                this.DOMStyle.setProperty('--timer-warning', '1');
            }
        };

    }

    private updateDisplay(_warningThreshold = 20000) {
        this.timerDisplayEl.textContent = `${String(this.inUnits.minutes).padStart(2, '0')}:${String(this.inUnits.seconds).padStart(2, '0')}:${String(this.inUnits.milliseconds).padStart(3, '0')}`;

        if (this.timeLeft < _warningThreshold) {
            this.flashWarning(this.timeLeft / _warningThreshold);
        }
    }

    private readonly interval = 1000;
    private lastFlashTime: number | undefined;

    private flashWarning(_warningValue: number): void {
        if (this.lastFlashTime && performance.now() - this.lastFlashTime >= Math.max((this.interval * _warningValue), 50)) {
            this.DOMStyle.setProperty('--timer-warning', this.DOMStyle.getPropertyValue('--timer-warning') == '1' ? '0' : '1');
        } else if (!this.lastFlashTime) {
            this.DOMStyle.setProperty('--timer-warning', '1');
        }
        this.lastFlashTime = performance.now();
    }
}