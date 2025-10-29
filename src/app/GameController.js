import { codeInputEl, keypadBtnEls, startButtonEl, setupFeedbackSection, toggleGameMenu, updateScoreSection, Controller } from '../app.js';
import { generateCode } from './code.js';
import { Signal } from './lib/Signal.js';
import { Timer } from './Timer.js';
import { localScores } from "./services/scores.js";

export class GameController {
    state = new Signal('En attente de demarrage');
    attemptsNb;
    attemptsLeft;
    codeLength;
    code;
    timer;

    constructor(_attempts, _codeLength, _time) {
        this.updateSettings(_attempts, _codeLength, _time);
    }

    updateSettings(_attempts, _codeLength, _time) {
        if (this.state.get() !== 'En attente de demarrage') {
            console.warn('Les paramètres ne peuvent être modifiés qu\'avant le début de la partie.');
            return;
        }
        this.attemptsNb = _attempts;
        this.codeLength = _codeLength;
        this.timer = new Timer(_time * 1000);
        setupFeedbackSection(this.attemptsNb, this.codeLength);
    }

    async start() {
        this.state.set('En cours');
        this.attemptsLeft = this.attemptsNb;
        toggleGameMenu();
        this.code = await generateCode(this.codeLength);
        this.timer.start();
        codeInputEl.disabled = false;
        for (const btn of keypadBtnEls) { btn.disabled = false; }
        codeInputEl.focus();
        startButtonEl.disabled = true;
    }

    win() {
        this.state.set('Gagne');
        this.timer.running = false;
        const newScore = score(this.timer.timeSpent, this.codeLength, this.attemptsNb - this.attemptsLeft);
        const _scores = localScores();
        _scores.push({ score: newScore, date: new Date().toLocaleString() });
        localStorage.setItem('scores', JSON.stringify(_scores));
        updateScoreSection();
        codeInputEl.disabled = true;
        for (const btn of keypadBtnEls) { btn.disabled = true; }
        playFireworks();
        setTimeout(() => { toggleGameMenu(); }, 4000);
    }

    lose() {
        this.state.set('Perdu, le code était : ' + this.code.join(''));
        this.timer.running = false;
        codeInputEl.disabled = true;
        for (const btn of keypadBtnEls) { btn.disabled = true; }
        playExplosions()
        setTimeout(() => { toggleGameMenu(); }, 4000);
    }

    reset() {
        this.state.set('En attente de demarrage');
        this.timer.running = false;
        this.attemptsLeft = 5;
        startButtonEl.disabled = false;
        codeInputEl.value = null;
        codeInputEl.disabled = true;
        for (const btn of keypadBtnEls) { btn.disabled = true; }
        this.timer.updateDisplay(this.timer.duration);
        document.documentElement.style.setProperty('--timer-warning', 0);
        setupFeedbackSection(this.attemptsNb, this.codeLength);
    }
}

export const score = (_timeSpent, _codeLength, _usedAttempts) => {
    const normalizedTime = _timeSpent / Controller.timer.duration;
    const maxPoints = Math.pow(10, _codeLength) / _usedAttempts;
    const score = Math.floor((Math.exp(-normalizedTime) + 1) * maxPoints);
    return score;
}

function playFireworks() {
    const colors = ['#ff4d4d', '#4dff4d', '#4d4dff', '#ffff4d', '#ff4dff', '#4dffff'];

    for (let i = 0; i < 100; i++) {
        const firework = document.createElement('span');
        firework.classList.add('firework');
        firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        firework.style.left = Math.random() * 100 + 'vw';
        firework.style.top = Math.random() * 100 + 'vh';
        firework.style.animationDuration = ((Math.random() + 1) * 3) + 's';
        setTimeout(() => {
            document.body.appendChild(firework);
        }, Math.random() * 1000);

        firework.addEventListener('animationend', () => {
            firework.remove();
        });
    }
}

function playExplosions() {
    const explosionEl = document.getElementById('explosion-template');

    for (let i = 0; i < 100; i++) {
        const explosion = document.createElement('span');
        explosion.classList.add('explosion');
        explosion.innerHTML = explosionEl.innerHTML;
        explosion.style.left = (Math.random() * 100) - 10 + 'vw';
        explosion.style.top = (Math.random() * 100) - 10 + 'vh';
        explosion.style.animationDuration = ((Math.random() + 1) * 3) + 's';
        setTimeout(() => {
            document.body.appendChild(explosion);
        }, Math.random() * 1000);

        explosion.addEventListener('animationend', () => {
            explosion.remove();
        });
    }

}
