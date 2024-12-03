import parseFloatNum from '../lib/parseFloatNum.js';

document.addEventListener("DOMContentLoaded", () => {
    const semiMajorAxisInput = document.getElementById("semiMajorAxis");
    const semiMinorAxisInput = document.getElementById("semiMinorAxis");
    const calculateButton = document.getElementById("calculateArea");
    const resultBlock = document.getElementById("resultBlock");

    function calculateOvalArea(a, b) {
        return Math.PI * a * b; 
    }

    calculateButton.addEventListener("click", () => {
        const a = parseFloatNum(semiMajorAxisInput.value);
        const b = parseFloatNum(semiMinorAxisInput.value);

        console.log(a, b);
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
            alert("Будь ласка, введіть коректні додатні числа для напівосей!");
            return;
        }

        if (a > 10000 || b > 10000) {
            alert("Значення напівосей не повинні перевищувати 10,000!");
            return;
        }

        const area = calculateOvalArea(a, b).toFixed(2);

        if (resultBlock) {
            resultBlock.textContent = `Площа овала: ${area} см²`;
        }
    });
});
