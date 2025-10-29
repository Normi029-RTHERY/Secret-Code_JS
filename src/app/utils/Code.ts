import { Game } from '../../app';
import { FeedbackStates } from '../types/FeedbackStates';
import { GameState } from '../types/GameState';

export class Code {
    code: Array<number | null> = [];

    constructor(_length: number) {
        for (let i = 0; i < _length; i++) {
            const digit = Math.floor(Math.random() * 10);
            this.code.push(digit);
        }
    }

    checkCode(_input: string) {
        // Vérifier que la longueur du code est correcte juste au cas ou
        if (_input.length !== this.code.length) {
            return;
        }

        const code = [...this.code]; // On clone le code pour pouvoir le modifier sans affecter l'original
        const input = _input.split('').map(d => Number.parseInt(d, 10));
        const feedback = new Array(code.length).fill(FeedbackStates.Incorrect);
        const leftToCheck = []; //rappel: Indices de la list "input" des chiffres à vérifier plus tard

        for (let i = 0; i < input.length; i++) {
            // Il y a plus de chances que le chiffre soit incorrect donc on check ça en premier
            if (!code.includes(input[i]!)) {
                feedback[i] = FeedbackStates.Incorrect;
            }
            // Ensuite on vérifie s'il est à la bonne place
            // Si oui on l'enlève du code à vérifier pour ne pas créer de faux ("doubles") positifs plus tard
            else if (input[i] === code[i]) {
                feedback[i] = FeedbackStates.Correct;
                code[i] = null;
            }
            // On ne peut pas etre sur qu'il soit quand meme dans le code tant qu'on n'a pas vérifié tous les autres chiffres
            // Ex : code = 1234, input = 2200 => si on ne vérifie pas tous les corrects en premier,
            // le premier 2 renverrait misplaced alors qu'il est incorrect
            // Donc on le met de côté
            else {
                leftToCheck.push(i);
            }
        }

        // Maintenant on peut vérifier les chiffres mis de côté puisqu'on a enlevé les corrects du code à vérifier
        for (const i of leftToCheck) {
            const matchingDigit = code.find(d => d === input[i]);
            if (matchingDigit === undefined) {
                feedback[i] = FeedbackStates.Incorrect;
            } else {
                feedback[i] = FeedbackStates.Misplaced;
                code[code.indexOf(matchingDigit)] = null; // On l'enlève du code à vérifier toujours pour éviter les faux positifs
            }
        }

        if (!feedback.includes(FeedbackStates.Incorrect) && !feedback.includes(FeedbackStates.Misplaced)) {
            Game.state.set(GameState.Won);
        } else if (Game.attemptsLeft <= 0) {
            Game.state.set(GameState.Lost);
        }

        return feedback;
    }
}