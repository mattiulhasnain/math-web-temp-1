# CalcHub - Modern Calculator Tools

CalcHub is a suite of powerful, easy-to-use calculators and conversion tools designed with modern technology and functional programming principles for accuracy and reliability.

![CalcHub Screenshot](https://via.placeholder.com/800x400?text=CalcHub+Modern+Calculator+Tools)

## Features

### Basic Calculator
- Perform everyday calculations with ease
- Addition, subtraction, multiplication, and division
- Decimal point operations
- Clear and delete functions
- Keyboard support for faster calculations
- Clean, user-friendly interface

### Scientific Calculator
- Advanced scientific functions
- Trigonometry (sin, cos, tan)
- Logarithms (log, ln)
- Powers and roots
- Constants (π, e)
- Memory operations
- Parentheses for complex expressions
- Radians/Degrees toggle

### Unit Converter
- Convert between multiple unit types:
  - Length (meters, feet, inches, etc.)
  - Weight (kg, pounds, ounces, etc.)
  - Temperature (Celsius, Fahrenheit, Kelvin)
  - Area (square meters, acres, etc.)
  - Volume (liters, gallons, etc.)
  - Time (seconds, minutes, hours, etc.)
  - Speed (km/h, mph, etc.)
- Real-time conversion
- Clean, intuitive interface

## Technologies Used
- HTML5
- CSS3 with responsive design
- JavaScript (with functional programming approach)
- No external dependencies - pure vanilla JS

## How to Run

### Method 1: Direct Browser Opening
Simply open the `index.html` file in any modern web browser.

### Method 2: Local Server
For the best experience, run the application using a local server:

1. If you have Node.js installed:
   ```
   npx http-server
   ```

2. If you have Python installed:
   ```
   # Python 3
   python -m http.server
   
   # Python 2
   python -m SimpleHTTPServer
   ```

3. Navigate to `http://localhost:8080` (or the port shown in your terminal)

## Project Structure
- `index.html` - Home page with links to all tools
- `calculator.html` - Basic calculator page
- `scientific-calculator.html` - Scientific calculator page
- `converter.html` - Unit converter page
- `script.js` - JavaScript code for the basic calculator
- `scientific-calculator.js` - JavaScript code for the scientific calculator
- `styles.css` - Common styles (though many styles are in-page for this project)

## Functional Programming Approach
This project uses a functional programming approach with:
- Pure functions where possible
- Immutable state
- Function composition
- Self-invoking function closures to encapsulate logic
- Separation of concerns between UI and calculations

## Responsive Design
The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Browser Compatibility
Tested and working on:
- Chrome
- Firefox
- Safari
- Edge

## License
This project is open source and available under the MIT License.

## Future Improvements
- Add more calculator types (mortgage, BMI, etc.)
- Create a history feature to recall previous calculations
- Add more unit conversion categories
- Implement dark/light theme toggle
- Add localization support for multiple languages 