

export default class MathUtil {
    
    static add(strNum1, strNum2) {
        let op1 = new Operand(strNum1);
        let op2 = new Operand(strNum2);
        op1.add(op2);
        return op1.numStr;
    }

    static sub(strNum1, strNum2) {
        let op1 = new Operand(strNum1);
        let op2 = new Operand(strNum2);
        op1.sub(op2);
        return op1.numStr;
    }

    static mul(strNum1, strNum2) {
        let op1 = new Operand(strNum1);
        let op2 = new Operand(strNum2);
        op1.mul(op2);
        return op1.numStr;
    }

    static div(strNum1, strNum2) {
        let op1 = new Operand(strNum1);
        let op2 = new Operand(strNum2);
        op1.div(op2);
        return op1.numStr;
    }

    static mod(strNum1, strNum2) {
        let op1 = new Operand(strNum1);
        let op2 = new Operand(strNum2);
        op1.mod(op2);
        return op1.numStr;
    }

    static pow(strNum1, strExp) {
        let op1 = new Operand(strNum1);
        let exp = new Operand(strExp);
        op1.pow(exp);
        return op1.numStr;
    }
}

class Operand{

    constructor(numStr) {
        this.numStr = numStr;
    }

    prepareNumbers(current, other) {
        const thisPrecision = current.calculatePrecision();
        const otherPrecision = other.calculatePrecision();
        const finalPrecision = Math.max(thisPrecision, otherPrecision);

        let otherStrCopy = other.numStr;

        otherStrCopy += '0'.repeat(finalPrecision - otherPrecision);
        current.numStr += '0'.repeat(finalPrecision - thisPrecision);

        let thisNumber = BigInt(current.numStr.replace('.', ''));
        let otherNumer = BigInt(otherStrCopy.replace('.', ''));

        return {N1: thisNumber, N2: otherNumer, precision: finalPrecision};
    }

    saveInStr(precision){
        let sign = this.numStr.indexOf('-') == -1 ? '' : '-';
        this.numStr = this.numStr.replace('-', '');
        this.numStr = this.numStr.padStart(precision  + 1, '0'); 
        this.numStr = sign + this.numStr.slice(0, this.numStr.length - precision) + (precision == 0 ? '' : '.') + this.numStr.slice(this.numStr.length - precision, this.numStr.length);
    }

    add(other) {
        const prep = this.prepareNumbers(this , other);
        const finalPrecision = prep.precision;
        let thisNumber = prep.N1;
        let otherNumer = prep.N2;
        
        thisNumber += otherNumer;
        this.numStr = thisNumber.toString();
        this.saveInStr(finalPrecision);
    }

    sub(other){
        let otherCopy = Object.assign(Object.create(Object.getPrototypeOf(other)), other)

        if(otherCopy.numStr.indexOf('-') == -1) {
            otherCopy.numStr = '-' + otherCopy.numStr;
        } else {
            otherCopy.numStr = otherCopy.numStr.replace('-', '');
        }
        this.add(otherCopy);
    }

    mul(other){
        const prep = this.prepareNumbers(this , other);
        const finalPrecision = prep.precision * 2;
        let thisNumber = prep.N1;
        let otherNumer = prep.N2;

        thisNumber *= otherNumer;
        this.numStr = thisNumber.toString();
        this.saveInStr(finalPrecision);
    }
   
    div(other) {
        const prep = this.prepareNumbers(this , other);
        
        const defaultPrecision = 20; //decimal part

        prep.N1 = ((BigInt(10 ** defaultPrecision) * prep.N1) / prep.N2);
        this.numStr = prep.N1.toString();
        this.saveInStr(defaultPrecision);
    }


    mod(other){
        const prep = this.prepareNumbers(this, other);
        prep.N1 = (prep.N1 % prep.N2);
        this.numStr = prep.N1.toString();
        this.saveInStr(prep.precision);
    }

    pow(other){

        this.numStr = Math.pow(this.numStr, other.numStr);
       
        // if(other.numStr.indexOf('.') != -1) {
        //     this.numStr = Math.pow(this.numStr, other.numStr);
        // } else {
        //     let precision = this.calculatePrecision() * Number(other.numStr);
        //     this.numStr = this.numStr.replace('.', '');

        //     this.numStr = (BigInt(this.numStr) ** BigInt(other.numStr)).toString();

        //     if(precision != 0) {
        //         this.saveInStr(precision);
        //     }

        // }
    }

    calculatePrecision() {
        let commaIndex = this.numStr.indexOf('.');
        return commaIndex == -1 ? 0 : this.numStr.length - (commaIndex + 1);
    }
}

let factPrecalc = [1n, 1n, 2n, 6n, 24n, 120n, 720n, 5040n, 40320n, 3628800n,3628800n,
                   39916800n, 479001600n, 6227020800n, 87178291200n, 1307674368000n,
                   20922789888000n, 355687428096000n, 6402373705728000n, 121645100408832000n,
                   2432902008176640000n, 51090942171709440000n, 1124000727777607680000n,
                   25852016738884976640000n, 620448401733239439360000n, 15511210043330985984000000n, 
                   403291461126605635584000000n, 10888869450418352160768000000n, 304888344611713860501504000000n,
                   8841761993739701954543616000000n, 265252859812191058636308480000000n];

export function fact(num) {
    
    if(num < factPrecalc.length){
        return factPrecalc[num] + "";
    }

    for(let i = factPrecalc.length; ; i++) {
        factPrecalc.push(factPrecalc[i - 1] * BigInt(i));
        if(i == num)
            return factPrecalc[i].toString();
    }

}
