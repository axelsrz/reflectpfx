"use strict";
// This top down parser was originally verbatim from Bjarne Stroupstrup's example in
// "The C++ Programming Language Third Edition" section 6.1.1 page 108.
// The operator precedence here, where it corresponds, follow that described on page 120 of the same book.
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalNary = exports.eval = void 0;
var currentToken;
function root(get) {
    return logicalOr(get);
}
function logicalOr(get) {
    let left = logicalAnd(get);
    for (;;) {
        switch (currentToken.token_type) {
            case 'LOGICAL_OR': {
                left = { token_type: 'logicalOr', operator: '||', left: left, right: logicalAnd(true) };
                break;
            }
            case 'OR': {
                left = { token_type: 'logicalOr', operator: ' Or ', left: left, right: logicalAnd(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function logicalAnd(get) {
    let left = equality(get);
    for (;;) {
        switch (currentToken.token_type) {
            case 'LOGICAL_AND': {
                left = { token_type: 'logicalAnd', operator: '&&', left: left, right: equality(true) };
                break;
            }
            case 'AND': {
                left = { token_type: 'logicalAnd', operator: ' And ', left: left, right: equality(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function equality(get) {
    let left = comparison(get);
    for (;;) {
        switch (currentToken.token_type) {
            case 'EQUAL': {
                left = { token_type: 'equality', operator: '=', left: left, right: comparison(true) };
                break;
            }
            case 'NOT_EQUAL': {
                left = { token_type: 'equality', operator: '<>', left: left, right: comparison(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function comparison(get) {
    let left = membership(get);
    for (;;) {
        switch (currentToken.token_type) {
            case 'LESS_THAN': {
                left = { token_type: 'comparison', operator: '<', left: left, right: membership(true) };
                break;
            }
            case 'GREATER_THAN': {
                left = { token_type: 'comparison', operator: '>', left: left, right: membership(true) };
                break;
            }
            case 'LESS_THAN_EQUAL': {
                left = { token_type: 'comparison', operator: '<=', left: left, right: membership(true) };
                break;
            }
            case 'GREATER_THAN_EQUAL': {
                left = { token_type: 'comparison', operator: '>=', left: left, right: membership(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function membership(get) {
    let left = expr(get);
    for (;;) {
        switch (currentToken.token_type) {
            case 'IN': {
                left = { token_type: 'membership', operator: ' In ', left: left, right: expr(true) };
                break;
            }
            case 'EXACTIN': {
                left = { token_type: 'membership', operator: ' ExactIn ', left: left, right: expr(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function expr(get) {
    let left = term(get);
    for (;;) {
        switch (currentToken.token_type) {
            case 'PLUS': {
                left = { token_type: 'expression', operator: '+', left: left, right: term(true) };
                break;
            }
            case 'MINUS': {
                left = { token_type: 'expression', operator: '-', left: left, right: term(true) };
                break;
            }
            case 'CONCAT': {
                left = { token_type: 'expression', operator: '&', left: left, right: term(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function term(get) {
    let left = prim(get);
    for (;;) {
        switch (currentToken.token_type) {
            case 'MUL': {
                left = { token_type: 'term', operator: '*', left: left, right: prim(true) };
                break;
            }
            case 'DIV': {
                left = { token_type: 'term', operator: '/', left: left, right: prim(true) };
                break;
            }
            case 'DOT': {
                left = { token_type: 'term', operator: '.', left: left, right: prim(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function prim(get) {
    if (get) {
        getToken();
    }
    switch (currentToken.token_type) {
        case 'NUMBER': {
            const v = currentToken.value;
            getToken();
            return postFix({ token_type: 'primary', match: 'number', value: v });
        }
        case 'TEXT_LITERAL': {
            const v = currentToken.value;
            getToken();
            return { token_type: 'primary', match: 'text_literal', value: v };
        }
        case 'SEGMENT_TEXT_LITERAL': {
            const v = currentToken.value;
            getToken();
            return { token_type: 'primary', match: 'segment_text_literal', value: v };
        }
        case 'BEGIN_STRING_INTERPOLATION': {
            const child = stringInterpolation();
            getToken();
            return { token_type: 'primary', match: 'string_interpolation', child: child };
        }
        case 'END_STRING_INTERPOLATION': {
            getToken();
            return { token_type: 'primary', match: 'segment_empty_expression' };
        }
        case 'LOGICAL_LITERAL': {
            const v = currentToken.value.toLowerCase();
            getToken();
            return { token_type: 'primary', match: 'logical_literal', value: v };
        }
        case 'NAME': {
            const name = currentToken.value;
            getToken();
            // function
            if (currentToken.token_type === 'LP') {
                getToken();
                if (currentToken.token_type === 'RP') {
                    getToken();
                    return postFix({ token_type: 'primary', match: 'function', name: name });
                }
                else {
                    const argumentList = args(false);
                    if (currentToken.token_type !== 'RP') {
                        throw new Error(') expected');
                    }
                    getToken();
                    return postFix({ token_type: 'primary', match: 'function', name: name, args: argumentList });
                }
            }
            // variable
            else {
                return postFix({ token_type: 'primary', match: 'variable', name: name });
            }
        }
        case 'AND': {
            const name = currentToken.value;
            getToken();
            if (currentToken.token_type === 'LP') {
                getToken();
                if (currentToken.token_type === 'RP') {
                    getToken();
                    return { token_type: 'primary', match: 'and', name: name };
                }
                else {
                    var argumentList = args(false);
                    if (currentToken.token_type !== 'RP') {
                        throw new Error(') expected');
                    }
                    getToken();
                    return { token_type: 'primary', match: 'and', name: name, args: argumentList };
                }
            }
            break;
        }
        case 'OR': {
            const name = currentToken.value;
            getToken();
            if (currentToken.token_type === 'LP') {
                getToken();
                if (currentToken.token_type === 'RP') {
                    getToken();
                    return { token_type: 'primary', match: 'or', name: name };
                }
                else {
                    var argumentList = args(false);
                    if (currentToken.token_type !== 'RP') {
                        throw new Error(') expected');
                    }
                    getToken();
                    return { token_type: 'primary', match: 'or', name: name, args: argumentList };
                }
            }
            break;
        }
        case 'NOT': {
            return { token_type: 'primary', match: 'not', child: prim(true) };
        }
        case 'BANG': {
            return { token_type: 'primary', match: 'bang', child: prim(true) };
        }
        case 'MINUS': {
            return { token_type: 'primary', match: 'unaryMinus', child: prim(true) };
        }
        case 'LP': {
            const e = root(true);
            if (currentToken.token_type !== 'RP') {
                throw new Error(') expected');
            }
            getToken();
            return postFix({ token_type: 'primary', match: 'parenthesis', child: e });
        }
        case 'SLP': {
            getToken();
            if (currentToken.token_type === 'SRP') {
                getToken();
                return postFix({ token_type: 'primary', match: 'inlineTable' });
            }
            else {
                const argumentList = args(false);
                if (currentToken.token_type !== 'SRP') {
                    throw new Error('] expected');
                }
                getToken();
                return postFix({ token_type: 'primary', match: 'inlineTable', args: argumentList });
            }
        }
        case 'CLP': {
            getToken();
            if (currentToken.token_type === 'CRP') {
                getToken();
                return { token_type: 'primary', match: 'inlineRecord' };
            }
            else {
                const r = records(false);
                if (currentToken.token_type !== 'CRP') {
                    throw new Error('} expected');
                }
                getToken();
                return { token_type: 'primary', match: 'inlineRecord', records: r };
            }
        }
        case 'INVALID': {
            throw new Error(`invalid input token received '${currentToken.value}'`);
        }
        default: {
            throw new Error(`primary expected, received '${currentToken.token_type}'`);
        }
    }
}
function postFix(primary) {
    if (currentToken.token_type === 'PERCENT') {
        getToken();
        return { token_type: 'primary', match: 'percent', child: primary };
    }
    else if (currentToken.token_type === 'AS') {
        getToken();
        if (currentToken.token_type !== 'NAME') {
            throw new Error('name expected following as operator');
        }
        const name = currentToken.value;
        getToken();
        return { token_type: 'primary', match: 'as', name: name, child: primary };
    }
    return primary;
}
function args(get) {
    let left = { token_type: 'args', right: root(get) };
    for (;;) {
        switch (currentToken.token_type) {
            case 'COMMA': {
                left = { token_type: 'args', left: left, right: root(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function records(get) {
    // the structure of this doesn't seem quite right - for example 'get' arg isn't used...
    if (currentToken.token_type !== 'NAME') {
        throw new Error('name expected in record');
    }
    const name = currentToken.value;
    getToken();
    if (currentToken.token_type !== 'COLON') {
        throw new Error(': expected in record');
    }
    let left = { token_type: 'record', name: name, right: root(true) };
    for (;;) {
        switch (currentToken.token_type) {
            case 'COMMA': {
                getToken();
                if (currentToken.token_type !== 'NAME') {
                    throw new Error('name expected in record');
                }
                const name = currentToken.value;
                getToken();
                if (currentToken.token_type !== 'COLON') {
                    throw new Error(': expected in record');
                }
                left = { token_type: 'record', left: left, name: name, right: root(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function stringInterpolation() {
    getToken();
    if (currentToken.token_type === 'END_STRING_INTERPOLATION') {
        return undefined;
    }
    let left = { token_type: 'stringInterpolation', right: root(false) };
    for (;;) {
        switch (currentToken.token_type) {
            case 'STRING_INTERPOLATION_SEPARATOR': {
                left = { token_type: 'stringInterpolation', left: left, right: root(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
// slightly odd getToken arrangement to plug into the Bjarne Stroustrup code above
// TODO: make parse tree point to the underlying token
let tokens;
let index;
function getToken() {
    if (currentToken && currentToken.token_type === 'END') {
        return;
    }
    // skip whitespace and comments - alternatively we could use array filter
    var token = tokens[index++];
    if (token.token_type === 'WS' || token.token_type === 'COMMENT') {
        token = tokens[index++];
    }
    currentToken = token;
}
function checkForUnconsumedTokens() {
    for (;;) {
        if (currentToken && currentToken.token_type === 'END') {
            break;
        }
        if (currentToken.token_type !== 'WS' && currentToken.token_type !== 'COMMENT') {
            throw new Error(`unconsumed input token ${currentToken.token_type} ${currentToken.value}`);
        }
        getToken();
    }
}
function evaluate(t) {
    tokens = t;
    index = 0;
    currentToken = undefined;
    getToken();
    if (currentToken && currentToken.token_type === 'END') {
        return undefined;
    }
    const v = root(false);
    checkForUnconsumedTokens();
    return v;
}
exports.eval = evaluate;
function evalNary(t) {
    const binaryTree = evaluate(t);
    const naryTree = binaryToNary(binaryTree);
    return naryTree;
}
exports.evalNary = evalNary;
function extractChildrenNodes(treeNode) {
    const result = [];
    if (treeNode.child) {
        result.push(treeNode.child);
        delete treeNode.child;
    }
    else {
        if (treeNode.left) {
            result.push(treeNode.left);
            delete treeNode.left;
        }
        if (treeNode.right) {
            result.push(treeNode.right);
            delete treeNode.right;
        }
    }
    return result;
}
function binaryToNary(bNode) {
    if (!bNode)
        return null;
    var leaves = extractChildrenNodes(bNode);
    bNode.children = [];
    leaves.forEach(element => {
        if (!element)
            return;
        var flatNode = binaryToNary(element);
        if (element.token_type != bNode.token_type) {
            bNode.children.push(flatNode);
        }
        else {
            bNode.children.push(...flatNode.children);
        }
    });
    return bNode;
}
