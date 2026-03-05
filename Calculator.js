// 1. State Variables
let currentInput = '0';
let previousInput = '';
let operation = null;

// 2. DOM Elements
const currentText = document.getElementById('current-operand');
const previousText = document.getElementById('previous-operand');
const historyList = document.getElementById('history-list');

// 3. Display Logic
function updateDisplay() {
    currentText.innerText = currentInput;
    if (operation != null) {
        previousText.innerText = `${previousInput} ${operation}`;
    } else {
        previousText.innerText = '';
    }
}

// 4. Input Logic
function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) return;
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function chooseOperation(op) {
    if (currentInput === '') return;
    if (previousInput !== '') compute();
    operation = op;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
}

function deleteNumber() {
    currentInput = currentInput.toString().slice(0, -1);
    if (currentInput === '') currentInput = '0';
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    updateDisplay();
}

// 5. History & Calculation Logic
function addToHistory(equation, result) {
    const emptyMsg = historyList.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const li = document.createElement('li');
    li.classList.add('history-item');
    li.innerHTML = `
        <div class="history-equation">${equation} =</div>
        <div class="history-result">${result}</div>
    `;
    
    li.onclick = () => {
        currentInput = result;
        updateDisplay();
    };

    historyList.prepend(li);
}

function compute() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '×': computation = prev * current; break;
        case '÷': 
            if (current === 0) {
                alert("Cannot divide by zero");
                return;
            }
            computation = prev / current; 
            break;
        default: return;
    }

    const fullEquation = `${previousInput} ${operation} ${currentInput}`;
    const result = computation.toString();

    // Add to History
    addToHistory(fullEquation, result);

    currentInput = result;
    operation = null;
    previousInput = '';
    updateDisplay();
}

function clearHistory() {
    historyList.innerHTML = '<li class="empty-msg">No calculations yet</li>';
}

// 6. Keyboard Support
window.addEventListener('keydown', e => {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '=' || e.key === 'Enter') compute();
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clearDisplay();
    if (e.key === '+') chooseOperation('+');
    if (e.key === '-') chooseOperation('-');
    if (e.key === '*') chooseOperation('×');
    if (e.key === '/') chooseOperation('÷');
});