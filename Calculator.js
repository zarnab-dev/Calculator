let currentInput = "";
let isDegree = true;

const currentOperandText = document.getElementById('current-operand');
const previousOperandText = document.getElementById('previous-operand');

function updateDisplay() {
    currentOperandText.innerText = currentInput || "0";
}

function appendNumber(char) {
    if (currentInput === "0" && char !== ".") currentInput = char;
    else currentInput += char;
    updateDisplay();
}

function appendFunction(func) {
    currentInput += func + "(";
    updateDisplay();
}

function clearDisplay() {
    currentInput = "";
    previousOperandText.innerText = "";
    updateDisplay();
}

function deleteNumber() {
    currentInput = currentInput.toString().slice(0, -1);
    updateDisplay();
}

// Inside compute()
function compute() {
    try {
        // 1. Prepare the expression string
        let expression = currentInput;

        // 2. Replace visual symbols with JS operators
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');

        // 3. Handle implicit multiplication like 5(6) or 2tan(45)
        expression = expression.replace(/(\d)\(/g, '$1*(');
        expression = expression.replace(/(\d)(sin|cos|tan|log|ln|√)/g, '$1*$2');

        // 4. Translate math functions to JavaScript's Math object
        // This handles things like tan(56) -> Math.tan(56 * Math.PI / 180)
        expression = expression.replace(/(sin|cos|tan)\(([^)]+)\)/g, (match, func, angle) => {
            // Assuming Degree mode. Use Math.PI / 180 to convert degrees to radians
            return `Math.${func}((${angle}) * Math.PI / 180)`;
        });

        // 5. Handle other functions
        expression = expression.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');
        expression = expression.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
        expression = expression.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');

        // 6. Auto-close parentheses to prevent "Unexpected end of input" errors
        const openBrackets = (expression.match(/\(/g) || []).length;
        const closedBrackets = (expression.match(/\)/g) || []).length;
        for (let i = 0; i < openBrackets - closedBrackets; i++) {
            expression += ")";
        }

        // 7. Calculate and format
        let result = eval(expression);
        
        // Round to 8 decimal places to avoid floating point glitches (like 0.000000000004)
        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(8));
        }

        addToHistory(currentInput, result);
        currentInput = result.toString();
        updateDisplay();
        
    } catch (e) {
        console.error(e);
        currentInput = "Error";
        updateDisplay();
    }
}
// Inside addToHistory()
function addToHistory(eq, res) {
    const list = document.getElementById('history-list');
    
    // Remove the "No calculations yet" message
    const emptyMsg = list.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const li = document.createElement('li');
    li.className = 'history-item';
    
    // We use a template that includes a small copy button
    li.innerHTML = `
        <div class="history-info">
            <div class="history-equation">${eq}</div>
            <div class="history-result">= ${res}</div>
        </div>
        <button class="copy-btn" onclick="copyToClipboard('${res}')">Copy</button>
    `;
    list.prepend(li);
}

// Function to actually copy the text
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Optional: Change button text briefly to show it worked
        alert("Copied: " + text);
    });
}

// Ensure the clear history function puts the message back
function clearHistory() {
    document.getElementById('history-list').innerHTML = '<li class="empty-msg" style="color: rgba(255,255,255,0.3); font-size: 0.8rem; text-align: center; margin-top: 20px;">No calculations yet</li>';
}

function toggleMode() {
    document.getElementById('basic-keys').classList.toggle('hidden');
    document.getElementById('advanced-keys').classList.toggle('hidden');
    const btn = document.getElementById('mode-toggle');
    btn.innerText = document.getElementById('basic-keys').classList.contains('hidden') ? '123' : '∛';
}

