import { evaluate } from "./expression-parser.js";
import { runTests } from "./test.js";


// runTests();

window.addEventListener('DOMContentLoaded', () => {
  const result = document.querySelector('.result');
  const history = document.querySelector('.history');
  const memory = document.querySelector('.memory');
  const buttons = document.getElementsByTagName('button');

  result.textContent = '0';
  let memoryValue = '0';

  // Show Memory('M') symbol
  function showMemory() {
    if (memoryValue === '0') {
      memory.style.display = 'none';
      return;
    }

    memory.style.display = 'block';
  }

  // Show all buttons
  function showAdition() {
    const calculator = document.querySelector('.calculator-container');
    const buttons = document.querySelectorAll('.operation-symbol, .number');
    const extensions = document.querySelectorAll('.extension');

    extensions.forEach(extension => {
      if (!extension.classList.contains('displayed')) {
        calculator.style.gridTemplateColumns = 'repeat(6, 1fr)';
        extension.classList.add('displayed');
        extension.style.display = 'flex';
        return;
      }

      calculator.style.gridTemplateColumns = 'repeat(4, 1fr)';
      extension.classList.remove('displayed');
      extension.style.display = 'none';    
    });

    const isShowAll = extensions[0].classList.contains('displayed') ? true : false;
    buttons.forEach(btn => {
      if (isShowAll) {
        btn.style.fontSize = '18px';
        return;
      }

      btn.style.fontSize = '28px';
    });
  }

  // 'Numbers'
  function addToExpression() {
    let output = result.textContent;

    if (output[output.length - 1] == ')') {
      result.textContent = output + '*' + this.textContent;
    } else {
      output === '0' ? result.textContent = this.textContent : result.textContent += this.textContent;
    }
  }

  // 'Operations'
  function addOperToExpression() {
    let output = result.textContent;
    let operation = this.textContent;
    const opers = output.match(/[\+\-\*\/\%\,]/g);
    const nums = output.match(/\d+(\.\d+)?/g);
    const funcs = output.match(/mod\b|pow\b|sqrt\b|fact\b|sin\b|cos\b|tg\b|ln\b/g);

    // For adding '*' before functions
    function lastIsNumberOrBracket() {
      return !isNaN(output[output.length - 1]) || output[output.length - 1] === ')';
    }

    // 'Show adition ↔'
    if (this.classList.contains('addition')) {
      showAdition();
      return;
    }

    // 'C'
    if (operation === 'C') {
      history.textContent = '';
      result.textContent = '0';
      return;
    }

    // 'Del'
    if (operation === 'Del') {
      if (/(pow|sqrt|mod|fact|sin|cos|tg|ln)\($/.test(output)) {
        let funcLen = funcs[funcs.length - 1].length + 1;
        output = output.substring(0, result.textContent.length - funcLen);
      } else {
        output = output.substring(0, result.textContent.length - 1);
      }

      output === '' ? result.textContent = '0' : result.textContent = output;
      return;
    }

    // '='
    if (operation === '=') {
      try {
        history.textContent = output;
        result.textContent = evaluate(output);
      } catch (err) {
        history.style.fontSize = `${14}px`;
        history.textContent = err;
      }
      return;
    }

    // 'x^y (pow)'
    if (operation === 'x^y') {

      if (output === '0') {
        result.textContent = 'pow(';
        return;
      }

      if (lastIsNumberOrBracket()) {
        output = output + '*';
      }
      
      result.textContent = output + 'pow(';
      return;
    }

    // '√ (sqrt)'
    if (operation === '√') {

      if (output === '0') {
        result.textContent = 'sqrt(';
        return;
      }

      if (lastIsNumberOrBracket()) {
        output = output + '*';
      }

      result.textContent = output + 'sqrt(';
      return;
    }

    // 'x!'
    if (operation === 'x!') {

      if (output === '0') {
        result.textContent = 'fact(';
        return;
      }

      if (lastIsNumberOrBracket()) {
        output = output + '*';
      }

      result.textContent = output + 'fact(';
      return;
    }

    // 'sin, cos, tg, ls, mod' 
    function addFunc(func) {
      if (output === '0') {
        result.textContent = `${func}(`;
        return;
      }

      if (lastIsNumberOrBracket()) {
        output = output + '*';
      }
      
      result.textContent = `${output}${func}(`;
    }
    
    if (operation === 'mod' || operation === 'sin' ||
        operation === 'cos' || operation === 'tg' || operation === 'ln') {

      addFunc(operation);
      return;
    }

    // '('
    if (operation === '(') {
      if (output === '0') {
        result.textContent = operation;
      } else if (!isNaN(output[output.length - 1])) {
        result.textContent = output + '*' + operation;
      } else if (output[output.length - 1] !== '.') {
        result.textContent = output + operation;
      }
      return;   
    }

    // ')'
    if (operation === ')') {
      if (output === '0') {
        result.textContent = operation;
      } else if (output[output.length - 1] !== '.') {
        result.textContent = output + operation;
      }
      return;   
    }

    // 'MC'
    if (operation === 'MC') {
      memoryValue = '0';
      history.textContent = 'MC';
      showMemory()
      return;
    } 

    // 'MR'
    if (operation === 'MR') {
      if (output === '0') {
        result.textContent = memoryValue;
        return;
      }

      if (!opers) {
        if (memoryValue.charAt(0) === '-') {
          result.textContent = output + memoryValue;
        } else {
          result.textContent = output + '+' + memoryValue;
        }
        return;
      }

      if (memoryValue.charAt(0) === '-') {
        result.textContent = output + '(' + memoryValue;
      } else {
        result.textContent = output + memoryValue;
      }

      history.textContent = 'MR';
      showMemory()
      return;
    } 

    // 'M-'
    if (operation === 'M-') {
      memoryValue = evaluate(`${memoryValue}-${output}`);
      history.textContent = 'M-';
      showMemory()
      return;
    } 

    // 'M+'
    if (operation === 'M+') {
      memoryValue = evaluate(`${memoryValue}+${output}`);
      history.textContent = 'M+';
      showMemory()
      return;
    } 

    // '+/-'
    if (operation === '+/-') {

      if (output === '0' || isNaN(output[output.length - 1])) {
        return;
      }

      let lastNum = nums[nums.length - 1];
      let indexOfLastNum = output.lastIndexOf(lastNum);
      let operBeforeNum = output.charAt(indexOfLastNum - 1);
      let stringBeforeNum = '';

      if (operBeforeNum === '-') {
        stringBeforeNum = output.substring(0, indexOfLastNum - 1);

        if (nums.length === 1 || output.charAt(indexOfLastNum - 2) === '(') {
          output = stringBeforeNum + lastNum;
        } else {
          output = stringBeforeNum + '+' + lastNum;
        }
      } else {
        stringBeforeNum = output.substring(0, indexOfLastNum - 1);
        if (operBeforeNum === '' || operBeforeNum === '+') {
          output = stringBeforeNum + '-' + output.substring(indexOfLastNum);
        } 

        if (operBeforeNum === '(') {
          output = stringBeforeNum + '(-' + output.substring(indexOfLastNum);
        }

        if (operBeforeNum === '/' || operBeforeNum === '*') {
          output = `${stringBeforeNum}${opers[opers.length - 1]}(-${output.substring(indexOfLastNum)}`;
        }
      }

      result.textContent = output;
      return;
    }

    // only one '.' in number
    if (operation === '.') {

      if (!opers) {
        if (output.indexOf('.') !== -1) {
          return;
        }

      } else {
        const lastOpers = opers[opers.length - 1];
        let lastOperIndex = output.lastIndexOf(lastOpers);
        let lastDotIndex = output.lastIndexOf('.');

        if (lastOperIndex < lastDotIndex) {
          return;
        }
      }
    }

    // only one ',' for one 'pow()' and 'mod()
    if (operation === ',') {
      const funcsForCheck = output.match(/mod\(\b|pow\(\b/g);
      const commas = output.match(/,/g);

      if (!funcsForCheck) {
        return;
      }

      if (commas) {
        if (commas.length + 1 > funcsForCheck.length) {
          return;
        }
      }
    }

    // if there are several characters in a row
    if (output.length >= 1 && isNaN(output[output.length - 1])) {

      if (output[output.length - 1] === ')') {
        if (operation !== '.') {
          result.textContent += operation;
          return;
        }
      }

      if (operation === '-') {
        if (output[output.length - 1] !== '(') {
          result.textContent = output + '(' + operation;
          return;
        }
        result.textContent = output + operation;

      } else {
        if (output[output.length - 1] === '('
            || output[output.length - 2] === '('
            || operation === '.') {
          return;
        }

        output = output.substring(0, output.length - 1);
        result.textContent = output + operation;
      }

      return;
    }

    result.textContent += operation;
  }

  // Edit text size as you type expression
  function adjustFontSize() {
    const textLengthResult = result.textContent.length;
    const textLengthHistory = history.textContent.length;

    if (textLengthResult >= 12) {
      const newFontSizeResult = Math.max(48 - textLengthResult, 18);
      result.style.fontSize = `${newFontSizeResult}px`;
      history.style.fontSize = `${14}px`;
    } else if (textLengthHistory >= 12) {
      result.style.fontSize = `${48}px`;
    } else {
      result.style.fontSize = `${48}px`;
      history.style.fontSize = `${24}px`;
    }
  };

  // Connect listeners for buttons
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].classList.contains('number')) {
      buttons[i].addEventListener('click', addToExpression);
    }

    if (buttons[i].classList.contains('operation-symbol')) {
      buttons[i].addEventListener('click', addOperToExpression);
    }

    buttons[i].addEventListener('click', adjustFontSize);
  }
});
