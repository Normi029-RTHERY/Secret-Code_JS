import { checkCode } from './app/code.js';
import { GameController } from './app/GameController.js';
import { sendMessage } from './app/services/chat.js';
import { distantScores, localScores } from './app/services/scores.js';

const rootEl = document.querySelector(':root');

export const startButtonEl = document.getElementById('start-btn');
const resetButtonEl = document.getElementById('reset-btn');

const statusTextEl = document.getElementById('status');

const feedbackSectionEl = document.getElementById('feedback-section');
const localScoresEl = document.getElementById('local-scores');
const globalScoresEl = document.getElementById('global-scores');

export const codeInputEl = document.getElementById('code-input');
export const keypadBtnEls = document.querySelectorAll('input.keypad-btn');
const submitButtonEl = document.getElementById('submit-btn');
const removeButtonEl = document.getElementById('remove-btn');

const attemptsNb = 5;
const codeLength = 4;
const time = 60; // secondes

export const Controller = new GameController(attemptsNb, codeLength, time);

async function init() {
    console.log('Initialisation du jeu');

    Controller.state.effect(() => {
        statusTextEl.textContent = Controller.state.get();
    });

    codeInputEl.addEventListener('input', e => handleNewInput(e));
    keypadBtnEls.forEach(btn => {
        btn.addEventListener('click', e => handleKeypadInput(e));
    });

    const gameBtnEl = document.getElementById('game-btn');
    gameBtnEl.addEventListener('click', toggleGameMenu);
    const helpBtnEl = document.getElementById('help-btn');
    helpBtnEl.addEventListener('click', toggleHelpMenu);
    const btnSend = document.getElementById('btn-send');
    btnSend.addEventListener('click', sendMessage);
}


export function setupFeedbackSection(_attemptsNb, _codeLength) {
    feedbackSectionEl.querySelectorAll('.attempt-digit').forEach(el => el.remove());
    const digitsNb = _attemptsNb * _codeLength;
    rootEl.style.setProperty('--feedback-columns', _codeLength);
    for (let i = 0; i < digitsNb; i++) {
        const digitEl = document.createElement('p');
        digitEl.classList.add('attempt-digit', 'unknown');
        feedbackSectionEl.appendChild(digitEl);
    }
}

function updateFeedback(_feedback, _input) {
    const allDigitsEl = feedbackSectionEl.querySelectorAll('.attempt-digit');
    const attemptIndex = Controller.attemptsNb - Controller.attemptsLeft - 1;

    _feedback.forEach((result, i) => {
        const digitEl = allDigitsEl[attemptIndex * Controller.codeLength + i];
        digitEl.textContent = _input[i];
        digitEl.classList.remove('unknown', 'correct', 'misplaced', 'incorrect');
        digitEl.classList.add(result);
    });
}

function handleKeypadInput(event) {
    event.preventDefault();
    codeInputEl.focus();
    const value = event.target.value;
    if (!value) return;
    codeInputEl.value += value;
    handleSubmit(codeInputEl.value);
}

function handleNewInput(event) {
    event.preventDefault();
    const value = event.target.value;
    if (!value) return;
    handleSubmit(value);
}

function handleSubmit(value) {
    if (value.length === codeLength) {
        Controller.attemptsLeft--;
        codeInputEl.value = null;
        const feedback = checkCode(value, Controller.code);
        updateFeedback(feedback, value);
    }
}

removeButtonEl.addEventListener('click', e => {
    e.preventDefault();
    codeInputEl.value = codeInputEl.value.slice(0, -1);
    codeInputEl.focus();
});

export function toggleGameMenu() {
    const gameMenuEl = document.getElementById('game-menu');
    gameMenuEl.classList.toggle('visible');
    const menuToggleIconEl = document.getElementById('menu-toggle-icon');
    if (gameMenuEl.classList.contains('visible')) {
        menuToggleIconEl.textContent = '🫣';
    } else {
        menuToggleIconEl.textContent = '👀';
    }
}

function toggleHelpMenu() {
    const helpMenuEl = document.getElementById('help-menu');
    helpMenuEl.classList.toggle('visible');
}

export async function updateScoreSection() {
    for (const { score, date } of localScores().slice(-5)) {
        const scoreEl = document.createElement('li');
        scoreEl.textContent = `Score ${date} : ${score}`;
        localScoresEl.appendChild(scoreEl);
    }
    
    const globalScores = await distantScores();

    for (const { score, date } of globalScores.sort((a, b) => b.score - a.score).slice(0, 5)) {
        const scoreEl = document.createElement('li');
        scoreEl.textContent = `Score ${date} : ${score}`;
        globalScoresEl.appendChild(scoreEl);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    init();
    updateScoreSection();
});

startButtonEl.addEventListener('click', Controller.start.bind(Controller));
resetButtonEl.addEventListener('click', Controller.reset.bind(Controller));