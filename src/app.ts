import type { GameSettings } from "./app/types/GameSettings";
import { GameController } from "./app/utils/GameController";

const settings: GameSettings = {
    allowedAttempts: 5,
    codeLength: 4,
    duration: 60
};

export const Game = new GameController(settings);