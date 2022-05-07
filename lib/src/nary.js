"use strict";
// TODO: this needs some serious testing!!!
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTree = exports.makeNaryPostFix = void 0;
// this function consolidates successive operators in the postfix representation
function makeNaryPostFix(binaryPostFix) {
    var operator = undefined;
    var last = 0;
    for (var i = 0; i < binaryPostFix.length; i++) {
        //if (binaryPostFix[i].operator === '&&' || binaryPostFix[i].operator === '||') {
        if (binaryPostFix[i].operator === '&&') {
            if (operator === undefined || operator !== binaryPostFix[i].operator) {
                last = i;
                operator = binaryPostFix[i].operator;
            }
            else if (operator === binaryPostFix[i].operator) {
                binaryPostFix[i].operands = binaryPostFix[last].operands + 1;
                binaryPostFix[last] = null;
                last = i;
            }
        }
        if (binaryPostFix[i].operator === '||') {
            operator = undefined;
        }
    }
    return binaryPostFix.filter(value => value !== null);
}
exports.makeNaryPostFix = makeNaryPostFix;
// regular postfix to tree translation using a stack
function makeTree(naryPostFix) {
    var stack = [];
    for (;;) {
        var element = naryPostFix.shift();
        if (element === undefined) {
            break;
        }
        if (element.operand) {
            stack.push(element);
        }
        else {
            var newNode = { operator: element.operator, children: [] };
            for (var i = 0; i < element.operands; i++) {
                newNode.children.push(stack.pop());
            }
            stack.push(newNode);
        }
    }
    return stack.pop();
}
exports.makeTree = makeTree;
