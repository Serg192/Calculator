
import MathUtil, {fact} from "./math-util.js"

export function evaluate(exprStr) {

    try {
        const tokenizer = new Tokenizer(exprStr);
        const parser = new RDParser(tokenizer);
        let result = parser.expression();
        return prepareForDisplay(result);
    } catch (err) {
       throw err;
    }
}

const TokenType = {
    LEFT_BRACKET: '(',
    RIGHT_BRACKET: ')',
    OP_PLUS: '+',
    OP_MINUS: '-',
    OP_MUL: '*',
    OP_DIV: '/',
    OP_PC: '%',
    NUMBER: 'number',
    FUNCTION: 'funtion',
    COMMA: ',',
    EOF: 'eof'
};

const functions = new Set(['pow', 'sqrt', 'fact', 'mod', 'sin', 'cos', 'tg', 'ln']);

const functionMap = new Map();

functionMap.set('sqrt', (args) => {
    if (args.length != 1)
        throw new Error('Invalid math expression!');
    return Math.sqrt(args[0]);
});

functionMap.set('pow', (args) => {
    if (args.length != 2)
        throw new Error('Invalid math expression!');
    return MathUtil.pow(args[0], args[1]);
});

functionMap.set('fact', (args) => {
    if (args.length != 1)
        throw new Error('Invalid math expression');
    if(args[0] < 0 || args[0] > 1500 || !Number.isInteger(+args[0])) {
            throw new Error("Invalid input");
    }
    
    return fact(args[0]);
});

functionMap.set('mod', (args) => {
    if(args.length != 2) {
        throw new Error('Invalid math expression');
    }
    return MathUtil.mod(args[0], args[1]);
});

functionMap.set('sin', (args) => {
    if(args.length != 1){
        throw new Error('Invalid math expression');
    }
    return Math.sin(parseFloat(args[0]) * (Math.PI/180)) + "";
});

functionMap.set('cos', (args) => {
    if(args.length != 1){
        throw new Error('Invalid math expression');
    }
    return Math.cos(parseFloat(args[0]) * (Math.PI/180)) + "";
});

functionMap.set('tg', (args) => {
    if(args.length != 1){
        throw new Error('Invalid math expression');
    }
    return Math.tan(parseFloat(args[0]) * (Math.PI/180)) + "";
});

functionMap.set('ln', (args) => {
    if(args.length != 1){
        throw new Error('Invalid math expression');
    }
    return Math.log(parseFloat(args[0])) + "";
});

class Tokenizer {

    position = 0;

    constructor(exprStr) {
        this.exprStr = exprStr;
        this.tokens = [];

        try {
            this.tokenize();
        } catch(err) {
            throw err;
        }
    }

    nextToken() {
        return this.tokens[this.position++];
    }

    moveBack() {
        this.position--;
    }

    getPosition() {
        return this.position;
    }


    isOperator(token) {
        return token.type == TokenType.OP_MUL ||
            token.type == TokenType.OP_DIV ||
            token.type == TokenType.OP_MINUS ||
            token.type == TokenType.OP_PLUS ||
            token.type === TokenType.OP_PC;
    }

    readFunctionName(currentPos) {
        let funcName = '';
        let currentChar = this.exprStr.charAt(currentPos);

        while (/[a-zA-Z]/.test(currentChar)) {
            funcName += currentChar;
            currentPos++;
            if (currentPos >= this.exprStr.length) break;

            currentChar = this.exprStr.charAt(currentPos);
        }

        if (functions.has(funcName)) {
            this.tokens.push({ type: TokenType.FUNCTION, val: funcName });
            return currentPos;
        }

        return -1;
    }

    tokenize() {
        let currentPos = 0;

        while (currentPos < this.exprStr.length) {
            let c = this.exprStr.charAt(currentPos);

            switch (c) {
                case '(':
                    this.tokens.push({ type: TokenType.LEFT_BRACKET, val: c });
                    currentPos++;
                    continue;
                case ')':
                    this.tokens.push({ type: TokenType.RIGHT_BRACKET, val: c });
                    currentPos++;
                    continue;
                case '+':
                    this.tokens.push({ type: TokenType.OP_PLUS, val: c });
                    currentPos++;
                    continue;
                case '-':
                    this.tokens.push({ type: TokenType.OP_MINUS, val: c });
                    currentPos++;
                    continue;
                case '*':
                    this.tokens.push({ type: TokenType.OP_MUL, val: c });
                    currentPos++;
                    continue;
                case '/':
                    this.tokens.push({ type: TokenType.OP_DIV, val: c });
                    currentPos++;
                    continue;
                case '%':
                    this.tokens.push({ type: TokenType.OP_PC, val: c });
                    currentPos++;
                    continue;
                case ',':
                    this.tokens.push({ type: TokenType.COMMA, val: c });
                    currentPos++;
                    continue;
                default:
                    if (/[0-9]/.test(c)) {
                        var number = c;
                        currentPos++;
                        while (currentPos < this.exprStr.length && /[0-9.]/.test(this.exprStr.charAt(currentPos))) {
                            number += this.exprStr.charAt(currentPos);
                            currentPos++;
                        }

                        this.tokens.push({ type: TokenType.NUMBER, val: number });
                    } else {
                        if (/\s/.test(c)) {
                            currentPos++;
                            continue;
                        } else if (/[a-zA-Z]/.test(c)) {
                            //read function name
                            currentPos = this.readFunctionName(currentPos);
                            if (currentPos == -1) {
                                throw new Error('Invalid math expression!');
                            }
                        } else {
                            throw new Error('Invalid math expression!');
                        }
                    }
            }
        }
        this.tokens.push({ type: TokenType.EOF, val: null });
    }
}

class RDParser {

    constructor(tokenizer) {
        this.tokenizer = tokenizer;
    }

    expression() {
        try {
            return this.plusMinus();
        } catch(err) {
            throw err;
        } 
    }

    plusMinus() {
        try {
            let result = this.mulDiv();
            while (true) {
                let token = this.tokenizer.nextToken();
                if (token.type == TokenType.OP_PLUS) {
                    result = MathUtil.add(result, this.mulDiv());
                } else if (token.type == TokenType.OP_MINUS) {
                    result = MathUtil.sub(result, this.mulDiv());
                } else if (token.type === TokenType.OP_PC) {
                   result = MathUtil.div((MathUtil.mul(result, this.factor())), '100');
                } else {
                    this.tokenizer.moveBack();
                    return result;
                }
            }
        } catch (err) {
            throw err;
        }
    }

    mulDiv() {
        try {
            let result = this.factor();
            while (true) {
                let token = this.tokenizer.nextToken();
                if (token.type == TokenType.OP_DIV) {
                    result = MathUtil.div(result, this.factor());
                    if(result == Infinity)
                        throw new Error('Invalid Math expression!');
                } else if (token.type == TokenType.OP_MUL) {
                    result = MathUtil.mul(result, this.factor());
                } else {
                    this.tokenizer.moveBack();
                    return result;
                }
            }
        } catch (err) {
            throw err;
        }
    }

    factor() {
        try {
            const currentToken = this.tokenizer.nextToken();
            if (currentToken.type == TokenType.FUNCTION) {
                return this.func(currentToken.val);
            } else if (currentToken.type == TokenType.OP_MINUS) {
                return (-this.factor()) + "";
            } else if (currentToken.type === TokenType.NUMBER) {
                return currentToken.val;
            } else if (currentToken.type === TokenType.LEFT_BRACKET) {
                let result = this.expression();
                const closingBracketToken = this.tokenizer.nextToken();
                if (closingBracketToken.type !== TokenType.RIGHT_BRACKET) {
                    throw new Error('Invalid math expression');
                }
                return result;
            } else {
                throw new Error('Invalid math expression');
            }
        } catch (err) {
            throw err;
        }
    }

    func(fName) {
        try {
            const lbracket = this.tokenizer.nextToken();
            let funcArguments = [];

            if (lbracket.type != TokenType.LEFT_BRACKET) {
                throw new Error('Invalid math expression!');
            }

            funcArguments.push(this.expression());


            while (this.tokenizer.nextToken().type == TokenType.COMMA) {
                funcArguments.push(this.expression());
            }

            this.tokenizer.moveBack();

            if (this.tokenizer.nextToken().type != TokenType.RIGHT_BRACKET) {
                throw new Error('Invalid math expression!');
            }

            return (functionMap.get(fName)(funcArguments)) + '';
        } catch (err) {
            throw err;
        }
    }

}

function removeLastZeros(numStr) {
    let numEnd = numStr.length - 1;

    while(numStr[numEnd] == '0') {
        numEnd --;
    }
    if(numStr[numEnd] == '.') numEnd--;
    
    return numStr.slice(0, numEnd + 1);
}

function prepareForDisplay(numStr){
    if(numStr.indexOf('.') != -1) {
        numStr = removeLastZeros(numStr);
    }
    return numStr;
}