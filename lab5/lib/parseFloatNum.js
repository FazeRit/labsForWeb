export default function parseFloatNum(str) {
    if (str === null || str === undefined || typeof str === 'boolean' || typeof str === 'object' && !Array.isArray(str)) {
        return NaN;
    }

    if(str === '-Infinity') return -Infinity;
    if(str === 'Infinity') return Infinity;
  
    if (Array.isArray(str)) {
        if (str.length === 0) return NaN;
        str = String(str[0]);
    }

    str = str.trim();

    if (!str) return NaN;

    let isNegative = false;
    if (str[0] === '-') {
        isNegative = true;
        str = str.slice(1);
    } else if (str[0] === '+') {
        str = str.slice(1);
    }

    let currentNumber = 0;
    let decimalMultiplier = 1;
    let isDecimalPart = false;
    let hasDigits = false;
    let exponentValue = 0;
    let hasExponent = false;
    let exponentNegative = false;

    function getValue(char) {
        const value = char.charCodeAt() - 48;
        return value >= 0 && value <= 9 ? value : NaN;
    }

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (char.toLowerCase() === 'e') {
            if (!hasDigits) return NaN;
            hasExponent = true;
            if (str[i + 1] === '-') {
                exponentNegative = true;
                i++;
            } else if (str[i + 1] === '+') {
                i++;
            }
            continue;
        }

        if (hasExponent) {
            const value = getValue(str[i]);
            if (isNaN(value)) return NaN;
            exponentValue = exponentValue * 10 + value;
            continue;
        }

        if (char === '.') {
            if (isDecimalPart) return currentNumber;
            isDecimalPart = true;
            continue;
        }

        const value = getValue(char);
        if (isNaN(value)) break;

        hasDigits = true;

        if (isDecimalPart) {
            decimalMultiplier /= 10;
            currentNumber += value * decimalMultiplier;
        } else {
            currentNumber = currentNumber * 10 + value;
        }
    }

    if (!hasDigits) return NaN;

    if (hasExponent) {
        exponentValue = exponentNegative ? -exponentValue : exponentValue;
        currentNumber *= Math.pow(10, exponentValue);
    }

    return isNegative ? -currentNumber : currentNumber;
}