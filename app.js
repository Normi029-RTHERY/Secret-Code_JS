const colorContainer = document.getElementById('color-container');
const aside = document.querySelector('aside');

let containerWidth = colorContainer.clientWidth;
let containerHeight = colorContainer.clientHeight;

document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < containerHeight; i++) {
        const id = `row-${i}`;
        colorContainer.innerHTML += `<div class="row" id="${id}" style="height: ${100 / containerHeight}%; background-color: hsl(${i * 360 / containerHeight}, 100%, 50%);"></div>`;
    }
});

colorContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('row')) {
        const rgbColor = event.target.style.backgroundColor;
        navigator.clipboard.writeText(rgbColor);
        console.log('Clicked color:', rgbColor);
        if (aside.children.length > 10) {
            aside.removeChild(aside.children[1]);
        }
        aside.innerHTML += `<p>${rgbColor}</p>`;
    }
});