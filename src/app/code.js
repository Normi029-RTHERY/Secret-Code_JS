import { Controller } from "../app.js";

export const generateCode = async (length) => {
    let code = [];
    for (let i = 0; i < length; i++) {
        const digit = Math.floor(Math.random() * 10);
        code.push(digit);
    }
    console.log('Code généré :', code.join(''));

    return code;
}

export function checkCode(_input, _code) {
    // Vérifier que la longueur du code est correcte juste au cas ou
    if (_input.length !== _code.length) {
        return;
    }

    const code = [..._code];
    const input = _input.split('').map(d => parseInt(d, 10));
    const feedback = Array(code.length).fill('incorrect');
    let leftToCheck = []; //rappel: Indices de la list "input" des chiffres à vérifier plus tard

    for (let i = 0; i < input.length; i++) {
        // Il y a plus de chances que le chiffre soit incorrect donc on check ça en premier
        if (!code.includes(input[i])) {
            feedback[i] = 'incorrect';
        }
        // Ensuite on vérifie s'il est à la bonne place
        // Si oui on l'enlève du code à vérifier pour ne pas créer de faux (/"doubles") positifs plus tard
        else if (input[i] === code[i]) {
            feedback[i] = 'correct';
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
        if (matchingDigit !== undefined) {
            feedback[i] = 'misplaced';
            code[code.indexOf(matchingDigit)] = null; // On l'enlève du code à vérifier toujours pour éviter les faux positifs
        } else {
            feedback[i] = 'incorrect';
        }
    }

    if (!feedback.includes('incorrect') && !feedback.includes('misplaced')) {
        Controller.win();
    } else if (Controller.attemptsLeft <= 0) {
        Controller.lose();
    }

    return feedback;
}