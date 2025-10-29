import { Game } from "../../app";
import type { Score } from "../types/Score";

export class ScoresService {
    private readonly localScores = JSON.parse(localStorage.getItem('secret-code-scores') || '[]') as Array<Score>;

    calculateScore(_timeSpent: number, _usedAttempts: number) {
        const normalizedTime = _timeSpent / Game.settings.duration;
        const maxPoints = Math.pow(10, Game.settings.codeLength) / _usedAttempts;
        const score = Math.floor((Math.exp(-normalizedTime) + 1) * maxPoints);
        return score;
    }

    addScore(score: number, time: number): void {
        this.localScores.push({ score, time, date: new Date() });
        this.localScores.sort((a, b) => b.score - a.score || a.date.getTime() - b.date.getTime());
        localStorage.setItem('secret-code-scores', JSON.stringify(this.localScores.slice(0, 10)));
    }

    getScores(): Array<Score> {
        return this.localScores;
    }
}