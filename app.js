const slider = document.getElementById("shoe-size");
const shoe = document.getElementById("shoe-image");
const increaseBtn = document.getElementById("increase-button");
const decreaseBtn = document.getElementById("decrease-button");
const sizeDisplay = document.getElementById("size-display");

const factor = 8;
const maxSize = 60;
const minSize = 20;

let shoeSize = 42;

document.addEventListener("DOMContentLoaded", () => {
    slider.value = shoeSize;
    sizeDisplay.textContent = shoeSize;
    shoe.style.width = `${shoeSize * factor}px`;
});

slider.addEventListener("input", (e) => {
    e.preventDefault();
    const size = e.target.value;
    shoe.style.width = `${size * factor}px`;
    sizeDisplay.textContent = size;
});

increaseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let size = parseInt(slider.value);
    if (size < maxSize) {
        size++;
        slider.value = size;
        shoe.style.width = `${size * factor}px`;
        sizeDisplay.textContent = size;
    }
});

decreaseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let size = parseInt(slider.value);
    if (size > minSize) {
        size--;
        slider.value = size;
        shoe.style.width = `${size * factor}px`;
        sizeDisplay.textContent = size;
    }
});
