let activeNumber = "0";


let operandone = "";
let operator = "";
let operandtwo = "";
let operatorSimbol = "";

let isNumber = /[0-9\.]/;  //RegEx to identify if it's a number
let isOperator = /[/*\-\+%!^÷×√]/;
let deleteKeys = ['Backspace', 'Delete', 'del'];
let resultKeys = ['Enter', '='];

const calcScreenBottom = document.getElementById('calcScreenBottom');
const calcScreenTop = document.getElementById('calcScreenTop');
const underScreen = document.getElementById('under-screen');
const numbersDiv = document.getElementById('numbers-div');
const operatorsDiv = document.getElementById('operators-div');
updateScreen();

operatorsDiv.addEventListener('click', e => {
    if (notButton(e)) return false;         //if i'm not clicking a button 
    if (isDeleteKey(e.target.id)) deleteDigit();
    if (e.target.id == 'ac') {
        activeNumber = "0";
        updateScreen();
        return false;
    }

    else if (calcScreenTop.textContent != "") {
        nextResultCalculation(e.target.id);
        updateScreen();
        return false;
    } else {
        updateOperation(e.target.id);
    }
    updateScreen();
});

numbersDiv.addEventListener('click', (e) => {
    if (calcScreenTop.textContent.slice(-1) == '=') {
        resetCalculator();
    }
    if (e.target.textContent == 'x10') {
        activeNumber = (activeNumber * 10).toString();
        updateScreen();
        return false;
    }
    if (e.target.textContent == '√')
        if (notButton(e)) return false;
    if (doublePoint(e.target.textContent)) return false;
    if (resultKeys.includes(e.target.textContent)) {
        finalResult();
        updateScreen();
        return false;
    }
    lastDigit = activeNumber.slice(-1);
    if (isOperator.test(lastDigit)) {
        //case factorial 
        calcScreenTop.textContent = activeNumber;
        activeNumber = '';
        console.log(activeNumber);
    }


    if (activeNumber == "0") activeNumber = "";
    console.log(e.target.textContent);
    activeNumber += e.target.textContent;
    updateScreen();
});

window.addEventListener("keydown", e => {
    // console.log(e.key);
    if (calcScreenTop.textContent.slice(-1) == '=') {
        resetCalculator();
    }
    if (doublePoint(e.key)) return false;
    if (isDeleteKey(e.key)) deleteDigit();
    if (resultKeys.includes(e.key)) finalResult();


    else if (isOperator.test(e.key)) {
        if (calcScreenTop.textContent != "") {
            nextResultCalculation(e.key);
            updateScreen();

            return false;
        }
        updateOperation(e.key);


        /*       console.log(operandone)
              console.log(operator()) */

    }

    else if (!(isNumber.test((e.key)))) return false;

    else {
        if (doublePoint(e.key)) return false;
        lastDigit = activeNumber.slice(-1);
        if (isOperator.test(lastDigit)) {
            //case factorial 
            calcScreenTop.textContent = activeNumber;
            activeNumber = '';
            console.log(activeNumber);
        }
        if (activeNumber == "0") activeNumber = "";
        activeNumber += e.key;
    }
    updateScreen();
});



















function finalResult() {
    operandtwo = activeNumber;
    if (operator == sqrt) calcScreenTop.textContent = calcScreenTop.textContent.slice(0, -1) + '^(1/' + operandtwo + ')=';
    else calcScreenTop.textContent += operandtwo + '=';
    activeNumber = operate(+operandone, operator, +operandtwo);
}

function resetCalculator() {
    calcScreenTop.textContent = "";
    operandone = "";
    operandtwo = "";
    operator = "";
    operatorSimbol = "";
    activeNumber = "0";
    updateScreen();
}

function nextResultCalculation(e) {
    operandtwo = activeNumber;
    activeNumber = '0';
    operandone = operate(+operandone, operator, +operandtwo);
    operator = pressedOperator(e)();
    generateOperatorSimbol(e);
    calcScreenTop.textContent = operandone + operatorSimbol;
}

function updateOperation(e) {
    operandone = activeNumber;
    operator = pressedOperator(e)();
    showLastPressedOperator(e);
}

function showLastPressedOperator(e) {
    generateOperatorSimbol(e);
    let lastDigit = activeNumber.slice(-1);
    if (isOperator.test(lastDigit)) {
        activeNumber = activeNumber.replace(lastDigit, operatorSimbol);
    } else {
        activeNumber += operatorSimbol;
    }
}

function generateOperatorSimbol(e) {
    operatorSimbol = e;
    convertDivMul();
}

function convertDivMul() {
    if (operatorSimbol == '/')
        operatorSimbol = '÷';
    if (operatorSimbol == '*')
        operatorSimbol = '×';
}

function pressedOperator(e) {
    return () => {
        switch (true) {
            case (e == '!'): return factorial;
            case (e == '√'): return sqrt;
            case (e == '%'): return mod;
            case (e == '^'): return power;
            case (e == '/'): return division;
            case (e == '*'): return multiply;
            case (e == '-'): return subtract;
            case (e == '+'): return addition;
        }
    };
}

function notButton(e) {
    return e.target.nodeName !== 'BUTTON';
}

function isDeleteKey(e) {
    return deleteKeys.includes(e);
}

function doublePoint(e) {
    return [...activeNumber].includes('.') && e == '.';
}

function deleteDigit() {
    activeNumber = activeNumber.slice(0, -1);
    if (activeNumber == "") activeNumber = "0";
}

function updateScreen() {
    calcScreenBottom.textContent = activeNumber.toString();
    calcScreenBottom.scrollLeft = calcScreenBottom.scrollWidth;
    console.log(activeNumber);
}

function operate(op1, operator, op2) {
    console.log(op1);
    console.log(op2);
    return operator(op1, op2);
}

function addition(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function division(a, b) {
    return a / b;
}

function multiply(a, b) {
    return a * b;
}

function power(a, b) {
    return a ** b;
}

function mod(a, b) {
    return a % b;
}
function sqrt(a, b) {
    return a ** (1 / b);
}
function factorial(a) {
    if (a == 0) return 1;
    total = 1;
    for (let i = 1; i <= a; i++) {
        total *= i;
    }
    return total;
}