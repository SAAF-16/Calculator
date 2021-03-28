let activeNumber = "0";
let operandone = "";
let operator = "";
let operandtwo = "";
let operatorSimbol = "";

let isNumber = /[0-9\.]/;  //RegEx to identify if it's a number
let isOperator = /[/*\-\+%!^÷×√]/; //RegEx to identify if it's an operator
let isSpecial = /[%!√^]/;
let deleteKeys = ['Backspace', 'Delete', 'del'];
let resultKeys = ['Enter', '='];

const calcScreenBottom = document.getElementById('calcScreenBottom');
const calcScreenTop = document.getElementById('calcScreenTop');
const numbersDiv = document.getElementById('numbers-div');
const operatorsDiv = document.getElementById('operators-div');

operatorsDiv.addEventListener('click', manageOperatorsButtons());
numbersDiv.addEventListener('click', manageNumbersButtons());
numbersDiv.addEventListener('keydown', avoidEnterKeyDefault());
window.addEventListener('keydown', keyboardToButtonManager());
window.addEventListener('mousedown', avoidMouseDefault());

updateScreen();






function avoidMouseDefault() {
    return (e) => {
        e.preventDefault();
    };
}

function keyboardToButtonManager() {
    return (e) => {
        switch (true) {
            case (e.key == '0'): clickButton('num-0'); break;
            case (e.key == '1'): clickButton('num-1'); break;
            case (e.key == '2'): clickButton('num-2'); break;
            case (e.key == '3'): clickButton('num-3'); break;
            case (e.key == '4'): clickButton('num-4'); break;
            case (e.key == '5'): clickButton('num-5'); break;
            case (e.key == '6'): clickButton('num-6'); break;
            case (e.key == '7'): clickButton('num-7'); break;
            case (e.key == '8'): clickButton('num-8'); break;
            case (e.key == '9'): clickButton('num-9'); break;
            case (e.key == '.'): clickButton('num-.'); break;
            case (e.key == '/'): clickButton('÷'); break;
            case (e.key == '*'): clickButton('×'); break;
            case (e.key == '-'): clickButton('-'); break;
            case (e.key == '+'): clickButton('+'); break;
            case (e.key == '!'): clickButton('!'); break;
            case (e.key == '%'): clickButton('%'); break;
            case (e.key == '^'): clickButton('^'); break;
            case (isResultKey(e.key)): clickButton('result'); break;
            case (isDeleteKey(e.key)): clickButton('del'); break;
        }
    };
}

function clickButton(x) {
    document.getElementById(x).click();
    document.getElementById(x).classList.add("active");
    addEventListener('keyup', () => {
        document.getElementById(x).classList.remove("active");
    });
}

function isResultKey(e) {
    return resultKeys.includes(e);
}

function manageNumbersButtons() {
    return (e) => {
        lastDigit = activeNumber.slice(-1);
        if ((calcScreenTop.textContent.slice(-1) == '=') && e.target.id == 'result') {
            if (isSpecial.test(operatorSimbol) || activeNumber == '0') return false;
            calcScreenTop.textContent = `${activeNumber}${operatorSimbol}${operandtwo}=`;
            activeNumber = operate(+activeNumber, operator, +operandtwo).toString();
            updateScreen();

            return false;
        }
        if (calcScreenTop.textContent.slice(-1) == '=') resetCalculator();
        if (notButton(e)) return false;
        if (doublePoint(e.target.textContent)) return false;
        if (resultKeys.includes(e.target.textContent)) finalResult();
        else if (isNumber.test(e.target.id)) {

            if (e.target.textContent == 'x10') {
                activeNumber = (activeNumber * 10).toString();
            }
            else if (isOperator.test(lastDigit)) {
                calcScreenTop.textContent = activeNumber;
                activeNumber = '0';
            }
            if (activeNumber == "0") activeNumber = "";
            activeNumber += e.target.textContent;
        }
        updateScreen();
    };
}

function manageOperatorsButtons() {
    return e => {
        if (notButton(e)) return false; //if i'm not clicking a button 
        else if (isDeleteKey(e.target.id)) deleteDigit();
        else if (e.target.id == 'ac') {
            activeNumber = "0";
        }
        else if (calcScreenTop.textContent.slice(-1) == '=') ansHandler(e);
        else if (calcScreenTop.textContent != "") {
            nextResultCalculation(e.target.id);
        } else {
            updateOperation(e.target.id);
        }
        updateScreen();
    };
}

function ansHandler(e) {
    calcScreenTop.textContent = "";
    activeNumber += e.target.id;
    updateOperation(e.target.id);
}

function avoidEnterKeyDefault() {
    return (e) => {
        if (e.key == 'Enter') {
            e.preventDefault();
            return false;
        }
    };
}

function finalResult() {
    operandtwo = activeNumber;

    if (operator == sqrt) calcScreenTop.textContent = calcScreenTop.textContent.slice(0, -1) + '^(1/' + operandtwo + ')=';
    else if (operator == mod) calcScreenTop.textContent = calcScreenTop.textContent.slice(0, -1) + 'mod' + operandtwo + '=';
    else calcScreenTop.textContent += operandtwo + '=';
    if (typeof (operandone) == 'number') operandone = operandone.toString();
    if (isOperator.test(operandone.slice(-1))) operandone = operandone.slice(0, -1);
    activeNumber = operate(+operandone, operator, +operandtwo).toString();
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
/*     if (operandone != "") operandone = activeNumber.slice(0, -1); //if i'ts not the first assignaton remove the operator at the end
    else */ operandone = activeNumber;
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
}

function pressedOperator(e) {
    return () => {
        switch (true) {
            case (e == '!'): return factorial;
            case (e == '√'): return sqrt;
            case (e == '%'): return mod;
            case (e == '^'): return power;
            case (e == '÷'): return division;
            case (e == '×'): return multiply;
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
}

function operate(op1, operator, op2) {
    if (operator == "") return activeNumber;
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