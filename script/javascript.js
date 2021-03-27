let operand1 = "0"
let operand2 = "0"

let isNumber = /[0-9\.]/ //RegEx to identify if it's a number
let deleteKeys = ['Backspace', 'Delete', 'del'];

const calcScreen = document.getElementById('calcScreen')
const underScreen = document.getElementById('under-screen');
const numbersDiv = document.getElementById('numbers-div');
const operatorsDiv = document.getElementById('operators-div');
updateScreen()

operatorsDiv.addEventListener('click', e => {
    const isButton = e.target.nodeName === 'BUTTON';
    if (!isButton) return;//if i'm not clicking a button 
    if (deleteKeys.includes(e.target.id)) {
        deleteNumber();
    }

    updateScreen();
})

numbersDiv.addEventListener('click', (e) => {
    console.log(e);
    const isButton = e.target.nodeName === 'BUTTON';
    if (!isButton) {  //if i'm not clicking the button
        return;
    }
    if (doublePoint(e.target.textContent)) return false
    if (operand1 == "0") operand1 = "";
    console.log(e.target.textContent)
    operand1 += e.target.textContent;
    updateScreen();
})

window.addEventListener("keydown", e => {
    if (doublePoint(e.key)) return false
    if (deleteKeys.includes(e.key)) {
        deleteNumber();
    }
    else if (!(isNumber.test((e.key)))) return false
    else {
        if (operand1 == "0") operand1 = "";
        operand1 += e.key;
    }
    updateScreen();
});



















function doublePoint(e) {
    return [...operand1].includes('.') && e == '.';
}

function deleteNumber() {
    operand1 = operand1.slice(0, -1);
    if (operand1 == "") operand1 = "0"
}

function updateScreen() {
    calcScreen.textContent = operand1.toString();
    calcScreen.scrollLeft = calcScreen.scrollWidth
    console.log(operand1)
}

function operate(operand1, operator, operand2) {
    return operator(operand1, operand2)
}

function add(a, b) {
    return a + b
}

function subtract(a, b) {
    return a - b
}

function division(a, b) {
    return a / b
}

function multiply(a, b) {
    return a * b
}

function power(a, b) {
    return a ** b
}

function mod(a, b) {
    return a % b
}
