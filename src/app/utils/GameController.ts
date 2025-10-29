import { Signal } from "../lib/Signal";
import type { GameSettings } from "../types/GameSettings";
import { GameState } from "../types/GameState";
import { Timer } from "./Timer";

export class GameController {
    settings: GameSettings;
    state = new Signal<GameState>();
    Timer: Timer | undefined;

    attemptsLeft: number;

    constructor(_settings: GameSettings) {
        this.settings = _settings;
        this.state.set(GameState.Idle);
        this.attemptsLeft = this.settings.allowedAttempts;
    }

    start(): void {
        this.state.set(GameState.Playing);
        this.Timer = new Timer(this.settings.duration);
    }

    reset(): void {
        this.state.set(GameState.Idle);
    }
}