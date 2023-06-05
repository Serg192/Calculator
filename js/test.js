import { evaluate } from "./expression-parser.js";
import MathUtil, {fact} from "./math-util.js"

//Tests
let tests = [
    {
        expression: '2 + 4',
        expected: 6
    },
    {
        expression: '4 - 0 + 2 + 10',
        expected: 16
    },
    {
        expression: '4.25 - 0.25 + 2',
        expected: 6
    },
    {
        expression: '3 * (2 + 2)',
        expected: 12
    },
    {
        expression: '3 * (4 - 3 * (0.25 + 1))',
        expected: 0.75
    },

    {
        expression: '-5 + 3',
        expected: -2
    },

    {
        expression: '5 + -3',
        expected: 2
    },

    {
        expression: '-5 + -3 * -4',
        expected: 7
    },

    {
        expression: 'mod(5, 7)',
        expected: 5
    },

    {
        expression: '-(2 + 2)',
        expected: -4
    },

    {
        expression: '(mod(9, 5) + 5) * 2',
        expected: 18
    },

    {
        expression: 'mod(8.6, 0.32)',
        expected: 0.28
    },

    {
        expression: '2 + sqrt(4) + 8',
        expected: 12
    },

    {
        expression: '2 + pow(1 + 1, 6 - 3) + 1',
        expected: 11
    },

    {
        expression: '(2 + pow(3 * (4 - 3 * (0.25 + 1)), 6 - 2) + 1) / 10',
        expected: 0.331640625
    },

    {  
        expression: '0.0075 - 0.12',
        expected: -0.1125
    },

    {          
        expression: '((4 + 2) * (8 / 2) - 5.5) + (10 / 2.5) - (1.2 * 3) + 7.7',
        expected: 26.6
    },

    {    // div by zero   
        expression: '((4 + 2) * (8 / 0) - 5.5) + (10 / 2.5) - (1.2 * 3) + 7.7',
        expected: 'error'
    },

    {  
        expression: '2 - sqrt(-2)',
        expected: 'error'
    },

    {  
        expression: '1000000000000000000000000000000000000000000000000000000000000000000000000000000000 * 78',
        expected: '78000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    },

    {  
        expression: 'sqrt(pow(2, 4))',
        expected: '4'
    },

    {  
        expression: 'fact(50))',
        expected: '30414093201713378043612608166064768844377641568960512000000000000'
    },
    {  //fix later
        expression: 'sqrt(fact(pow(2, 2)))',
        expected: '4.898979485566356'
    },

    {
        expression: '1500 - 1000 % 50', //output 250
        expected: '250'
    },

    {
        expression: 'pow(0.2, 2)', 
        expected: '0.04'
    },

    {
        expression: 'pow(5, 3)', 
        expected: 125
    },

    {
        expression: 'pow(5, 3.2)', 
        expected: 172.4662076826519
    }, 

    {
        expression: 'sin(60)', 
        expected: 0.8660254037844386
    }, 

    {
        expression: 'ln(6)', 
        expected: 1.791759469228055
    }, 

];

export function runTests() {
    tests.forEach(testCase => {
       try{
            let result = evaluate(testCase.expression);
            console.log(`checking: expected= ${testCase.expected}, actual= ${result}`);
            console.assert(result == testCase.expected, `TEST FAILED`);
       } catch(err) {
            if(testCase.expected != 'error') {
                console.log(err);
                throw new Error('TEST FAILED');
            }
       }
       
    });
}

