// Scientific Calculator with functional programming approach
const ScientificCalculator = (function() {
    // DOM Elements
    const previousOperandTextElement = document.getElementById('previous-operand');
    const currentOperandTextElement = document.getElementById('current-operand');
    const numberButtons = document.querySelectorAll('.number');
    const operationButtons = document.querySelectorAll('.operator');
    const functionButtons = document.querySelectorAll('.function-button');
    const constantButtons = document.querySelectorAll('.constant-button');
    const memoryButtons = document.querySelectorAll('.memory-button');
    const equalsButton = document.getElementById('equals');
    const clearButton = document.getElementById('clear');
    const deleteButton = document.getElementById('delete');
    
    // Initial state
    const _state = {
        currentOperand: '0',
        previousOperand: '',
        operation: undefined,
        memory: 0,
        shouldResetScreen: false,
        isInRadianMode: true,
        lastAnswer: 0
    };
    
    // Constants
    const PI = Math.PI;
    const E = Math.E;
    
    // Initialize the calculator
    function init() {
        // Add event listeners for number buttons
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                const newState = appendNumber(
                    _state.currentOperand,
                    button.innerText,
                    _state.shouldResetScreen
                );
                _state.currentOperand = newState.currentOperand;
                _state.shouldResetScreen = newState.shouldResetScreen;
                updateDisplay();
            });
        });
        
        // Add event listeners for operation buttons
        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                const operation = button.id === 'add' ? '+' :
                                button.id === 'subtract' ? '-' :
                                button.id === 'multiply' ? '*' :
                                button.id === 'divide' ? '/' :
                                button.id === 'percent' ? '%' : null;
                
                if (operation) {
                    const newState = chooseOperation(
                        _state.currentOperand,
                        _state.previousOperand,
                        operation,
                        _state.operation
                    );
                    _state.previousOperand = newState.previousOperand;
                    _state.currentOperand = newState.currentOperand;
                    _state.operation = newState.operation;
                    _state.shouldResetScreen = true;
                    updateDisplay();
                }
            });
        });
        
        // Add event listeners for scientific function buttons
        functionButtons.forEach(button => {
            button.addEventListener('click', () => {
                handleScientificFunction(button.id);
            });
        });
        
        // Add event listeners for constant buttons
        constantButtons.forEach(button => {
            button.addEventListener('click', () => {
                handleConstant(button.id);
            });
        });
        
        // Add event listeners for memory function buttons
        memoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                handleMemoryFunction(button.id);
            });
        });
        
        // Add event listener for equals button
        equalsButton.addEventListener('click', () => {
            const newState = compute(
                _state.currentOperand,
                _state.previousOperand,
                _state.operation
            );
            _state.currentOperand = newState.currentOperand;
            _state.previousOperand = newState.previousOperand;
            _state.operation = newState.operation;
            _state.shouldResetScreen = true;
            _state.lastAnswer = parseFloat(_state.currentOperand);
            updateDisplay();
        });
        
        // Add event listener for clear button
        clearButton.addEventListener('click', () => {
            const newState = clear();
            _state.currentOperand = newState.currentOperand;
            _state.previousOperand = newState.previousOperand;
            _state.operation = newState.operation;
            updateDisplay();
        });
        
        // Add event listener for delete button
        deleteButton.addEventListener('click', () => {
            _state.currentOperand = deleteNumber(_state.currentOperand);
            updateDisplay();
        });
        
        // Add event listener for rad/deg button
        document.getElementById('rad-deg').addEventListener('click', () => {
            _state.isInRadianMode = !_state.isInRadianMode;
            document.getElementById('rad-deg').innerText = _state.isInRadianMode ? 'RAD' : 'DEG';
        });
        
        // Add keyboard support
        document.addEventListener('keydown', handleKeyboardInput);
        
        // Initialize display
        updateDisplay();
    }
    
    // Append a number to the current operand
    function appendNumber(currentOperand, number, shouldResetScreen) {
        if (number === '.' && currentOperand.includes('.')) return { currentOperand, shouldResetScreen };
        
        if (shouldResetScreen || currentOperand === '0') {
            return { 
                currentOperand: number === '.' ? '0.' : number,
                shouldResetScreen: false
            };
        }
        
        return {
            currentOperand: currentOperand + number,
            shouldResetScreen: false
        };
    }
    
    // Handle operation selection
    function chooseOperation(currentOperand, previousOperand, operation, currentOperation) {
        if (currentOperand === '') return { previousOperand, currentOperand, operation: currentOperation };
        
        if (previousOperand !== '') {
            const computeResult = compute(currentOperand, previousOperand, currentOperation);
            return {
                previousOperand: computeResult.currentOperand,
                currentOperand: '',
                operation
            };
        }
        
        return {
            previousOperand: currentOperand,
            currentOperand: '',
            operation
        };
    }
    
    // Compute the result of an operation
    function compute(currentOperand, previousOperand, operation) {
        if (previousOperand === '' || currentOperand === '') {
            return { currentOperand, previousOperand, operation };
        }
        
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        let computation;
        
        try {
            switch(operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        throw new Error('Division by zero');
                    }
                    computation = prev / current;
                    break;
                case '%':
                    computation = prev % current;
                    break;
                default:
                    return { currentOperand, previousOperand, operation };
            }
            
            return {
                currentOperand: computation.toString(),
                previousOperand: '',
                operation: undefined
            };
        } catch (error) {
            return {
                currentOperand: error.message,
                previousOperand: '',
                operation: undefined
            };
        }
    }
    
    // Clear the calculator
    function clear() {
        return {
            currentOperand: '0',
            previousOperand: '',
            operation: undefined
        };
    }
    
    // Delete the last digit
    function deleteNumber(currentOperand) {
        if (currentOperand === '0' || currentOperand.length === 1) {
            return '0';
        }
        
        if (currentOperand === 'Infinity' || currentOperand === 'NaN' || 
            currentOperand === 'Error' || currentOperand === 'Division by zero') {
            return '0';
        }
        
        return currentOperand.slice(0, -1);
    }
    
    // Format number for display
    function getDisplayNumber(number) {
        if (number === 'Infinity' || number === 'NaN' || 
            number === 'Error' || number === 'Division by zero') {
            return number;
        }
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    // Update the display
    function updateDisplay() {
        currentOperandTextElement.innerText = getDisplayNumber(_state.currentOperand);
        
        if (_state.operation != null) {
            previousOperandTextElement.innerText = 
                `${getDisplayNumber(_state.previousOperand)} ${_state.operation}`;
        } else {
            previousOperandTextElement.innerText = '';
        }
    }
    
    // Handle scientific functions
    function handleScientificFunction(functionId) {
        const current = parseFloat(_state.currentOperand);
        let result;
        
        try {
            switch (functionId) {
                case 'sin':
                    result = _state.isInRadianMode ? 
                        Math.sin(current) : 
                        Math.sin(current * Math.PI / 180);
                    break;
                case 'cos':
                    result = _state.isInRadianMode ? 
                        Math.cos(current) : 
                        Math.cos(current * Math.PI / 180);
                    break;
                case 'tan':
                    result = _state.isInRadianMode ? 
                        Math.tan(current) : 
                        Math.tan(current * Math.PI / 180);
                    break;
                case 'log':
                    if (current <= 0) throw new Error('Invalid input for log');
                    result = Math.log10(current);
                    break;
                case 'ln':
                    if (current <= 0) throw new Error('Invalid input for ln');
                    result = Math.log(current);
                    break;
                case 'x-square':
                    result = Math.pow(current, 2);
                    break;
                case 'cube':
                    result = Math.pow(current, 3);
                    break;
                case 'square-root':
                    if (current < 0) throw new Error('Invalid input for square root');
                    result = Math.sqrt(current);
                    break;
                case 'factorial':
                    if (current < 0 || !Number.isInteger(current)) 
                        throw new Error('Invalid input for factorial');
                    result = factorial(current);
                    break;
                case 'reciprocal':
                    if (current === 0) throw new Error('Division by zero');
                    result = 1 / current;
                    break;
                case 'power':
                    _state.previousOperand = _state.currentOperand;
                    _state.operation = 'pow';
                    _state.shouldResetScreen = true;
                    _state.currentOperand = '';
                    updateDisplay();
                    return;
                case 'ans':
                    result = _state.lastAnswer;
                    break;
                case 'parenthesis-open':
                case 'parenthesis-close':
                    // Would need more complex parsing for full expression evaluation
                    return;
                case 'second':
                    // Toggle between primary and secondary functions (not implemented in this version)
                    return;
                default:
                    return;
            }
            
            _state.currentOperand = result.toString();
            _state.shouldResetScreen = true;
            updateDisplay();
        } catch (error) {
            _state.currentOperand = error.message;
            _state.shouldResetScreen = true;
            updateDisplay();
        }
    }
    
    // Calculate factorial (recursive pure function)
    function factorial(n) {
        return (n <= 1) ? 1 : n * factorial(n - 1);
    }
    
    // Handle constants
    function handleConstant(constantId) {
        switch (constantId) {
            case 'pi':
                _state.currentOperand = PI.toString();
                break;
            case 'e':
                _state.currentOperand = E.toString();
                break;
        }
        _state.shouldResetScreen = true;
        updateDisplay();
    }
    
    // Handle memory functions
    function handleMemoryFunction(memoryId) {
        const current = parseFloat(_state.currentOperand);
        
        switch (memoryId) {
            case 'mc': // Memory Clear
                _state.memory = 0;
                break;
            case 'mr': // Memory Recall
                _state.currentOperand = _state.memory.toString();
                _state.shouldResetScreen = true;
                break;
            case 'ms': // Memory Store
                _state.memory = current;
                _state.shouldResetScreen = true;
                break;
            case 'm-plus': // Memory Add
                _state.memory += current;
                _state.shouldResetScreen = true;
                break;
            case 'm-minus': // Memory Subtract
                _state.memory -= current;
                _state.shouldResetScreen = true;
                break;
        }
        
        updateDisplay();
    }
    
    // Handle keyboard input
    function handleKeyboardInput(e) {
        if (e.key >= '0' && e.key <= '9') {
            const newState = appendNumber(
                _state.currentOperand,
                e.key,
                _state.shouldResetScreen
            );
            _state.currentOperand = newState.currentOperand;
            _state.shouldResetScreen = newState.shouldResetScreen;
            updateDisplay();
        } else if (e.key === '.') {
            const newState = appendNumber(
                _state.currentOperand,
                '.',
                _state.shouldResetScreen
            );
            _state.currentOperand = newState.currentOperand;
            _state.shouldResetScreen = newState.shouldResetScreen;
            updateDisplay();
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') {
            const newState = chooseOperation(
                _state.currentOperand,
                _state.previousOperand,
                e.key,
                _state.operation
            );
            _state.previousOperand = newState.previousOperand;
            _state.currentOperand = newState.currentOperand;
            _state.operation = newState.operation;
            _state.shouldResetScreen = true;
            updateDisplay();
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            const newState = compute(
                _state.currentOperand,
                _state.previousOperand,
                _state.operation
            );
            _state.currentOperand = newState.currentOperand;
            _state.previousOperand = newState.previousOperand;
            _state.operation = newState.operation;
            _state.shouldResetScreen = true;
            _state.lastAnswer = parseFloat(_state.currentOperand);
            updateDisplay();
        } else if (e.key === 'Escape') {
            const newState = clear();
            _state.currentOperand = newState.currentOperand;
            _state.previousOperand = newState.previousOperand;
            _state.operation = newState.operation;
            updateDisplay();
        } else if (e.key === 'Backspace') {
            _state.currentOperand = deleteNumber(_state.currentOperand);
            updateDisplay();
        } else if (e.key === 'p') {
            handleConstant('pi');
        } else if (e.key === '(' || e.key === ')') {
            // Would need more complex parsing for full expression evaluation
        }
    }
    
    // Public methods
    return {
        init
    };
})();

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', ScientificCalculator.init); 