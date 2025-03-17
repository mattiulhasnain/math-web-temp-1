// CalcHub 3.0 - Common UI functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    setupCalculator();
    setupEventListeners();
});

// Mobile navigation handling
function initializeNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        }
    });
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    // Elements with animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const animateOnScroll = () => {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run once on load
    animateOnScroll();
    
    // Add event listener for scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Set up general event listeners
function setupEventListeners() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Handle card hover effects for better performance
    const cards = document.querySelectorAll('.card');
    if (cards) {
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover');
            });
        });
    }
}

// Basic calculator functionality
function setupCalculator() {
    // Only run on calculator pages
    const calculatorContainer = document.querySelector('.calculator-container');
    if (!calculatorContainer) return;
    
    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-operation]');
    const equalsButton = document.querySelector('[data-equals]');
    const deleteButton = document.querySelector('[data-delete]');
    const allClearButton = document.querySelector('[data-all-clear]');
    const previousOperandTextElement = document.querySelector('[data-previous-operand]');
    const currentOperandTextElement = document.querySelector('[data-current-operand]');
    
    // Initialize variables
    let currentOperand = '';
    let previousOperand = '';
    let operation = undefined;
    let calculationComplete = false;
    
    // Add event listeners
    if (numberButtons) {
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                appendNumber(button.innerText);
                updateDisplay();
            });
        });
    }
    
    if (operationButtons) {
        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                chooseOperation(button.innerText);
                updateDisplay();
            });
        });
    }
    
    if (equalsButton) {
        equalsButton.addEventListener('click', () => {
            compute();
            updateDisplay();
        });
    }
    
    if (allClearButton) {
        allClearButton.addEventListener('click', () => {
            clear();
            updateDisplay();
        });
    }
    
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            deleteDigit();
            updateDisplay();
        });
    }
    
    // Handle keyboard input
    document.addEventListener('keydown', handleKeyboardInput);
    
    // Core calculator functions
    function appendNumber(number) {
        if (number === '.' && currentOperand.includes('.')) return;
        
        if (calculationComplete) {
            currentOperand = number;
            calculationComplete = false;
        } else {
            currentOperand += number;
        }
    }
    
    function chooseOperation(op) {
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            compute();
        }
        
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
    }
    
    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        currentOperand = String(computation);
        operation = undefined;
        previousOperand = '';
        calculationComplete = true;
    }
    
    function clear() {
        currentOperand = '';
        previousOperand = '';
        operation = undefined;
        calculationComplete = false;
    }
    
    function deleteDigit() {
        if (calculationComplete) {
            clear();
            return;
        }
        
        currentOperand = currentOperand.toString().slice(0, -1);
    }
    
    function getDisplayNumber(number) {
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
    
    function updateDisplay() {
        if (currentOperandTextElement) {
            currentOperandTextElement.innerText = getDisplayNumber(currentOperand);
        }
        
        if (previousOperandTextElement) {
            if (operation != null) {
                previousOperandTextElement.innerText = `${getDisplayNumber(previousOperand)} ${operation}`;
            } else {
                previousOperandTextElement.innerText = '';
            }
        }
    }
    
    function handleKeyboardInput(event) {
        // Number keys
        if (/^[0-9]$/.test(event.key)) {
            appendNumber(event.key);
            updateDisplay();
        }
        
        // Decimal point
        if (event.key === '.') {
            appendNumber(event.key);
            updateDisplay();
        }
        
        // Operation keys
        if (['+', '-', '*', '/'].includes(event.key)) {
            const opMap = {
                '*': '×',
                '/': '÷'
            };
            chooseOperation(opMap[event.key] || event.key);
            updateDisplay();
        }
        
        // Enter key for equals
        if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            compute();
            updateDisplay();
        }
        
        // Backspace for delete
        if (event.key === 'Backspace') {
            deleteDigit();
            updateDisplay();
        }
        
        // Clear
        if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
            clear();
            updateDisplay();
        }
    }
}

// Theme switcher
function initializeThemeSwitcher() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    
    if (themeSwitcher) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
            if (savedTheme === 'light') {
                themeSwitcher.classList.add('active');
            }
        }
        
        // Toggle theme on click
        themeSwitcher.addEventListener('click', () => {
            themeSwitcher.classList.toggle('active');
            
            if (themeSwitcher.classList.contains('active')) {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
}

// Page transitions
function initializePageTransitions() {
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    
    if (transitionOverlay) {
        // Page is fully loaded, fade out overlay
        window.addEventListener('load', () => {
            transitionOverlay.classList.add('loaded');
            setTimeout(() => {
                transitionOverlay.style.display = 'none';
            }, 500);
        });
        
        // Setup transition for outgoing links
        document.querySelectorAll('a').forEach(link => {
            // Skip links that open in new tab or are anchors
            if (link.target === '_blank' || link.href.includes('#') || 
                link.getAttribute('data-no-transition') === 'true') {
                return;
            }
            
            link.addEventListener('click', (e) => {
                const destination = link.href;
                
                // Skip if it's the same page
                if (destination === window.location.href) {
                    return;
                }
                
                e.preventDefault();
                
                // Show transition overlay
                transitionOverlay.style.display = 'block';
                setTimeout(() => {
                    transitionOverlay.classList.remove('loaded');
                }, 10);
                
                // Navigate after transition effect
                setTimeout(() => {
                    window.location.href = destination;
                }, 500);
            });
        });
    }
}

// Initialize common search functionality
function initializeSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    const searchClose = document.querySelector('.search-close');
    
    if (searchToggle && searchOverlay) {
        // Toggle search overlay
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        });
        
        // Close search overlay
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
        
        // Close search on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }
}

// Dark mode detection
function setupDarkModeDetection() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme if no saved preference
    if (!localStorage.getItem('theme')) {
        if (prefersDarkScheme.matches) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
        }
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        // Only change theme if user hasn't explicitly chosen one
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
            }
        }
    });
}

// Initialize all common functionality
function initializeCommonFunctionality() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeThemeSwitcher();
    initializePageTransitions();
    initializeSearch();
    setupDarkModeDetection();
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCommonFunctionality();
    
    // Initialize calculator if present
    if (document.getElementById('current-operand')) {
        setupCalculator();
    }
}); 