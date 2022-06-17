// This top down parser was originally verbatim from Bjarne Stroupstrup's example in
// "The C++ Programming Language Third Edition" section 6.1.1 page 108.
// The operator precedence here, where it corresponds, follow that described on page 120 of the same book.

import { tokenize } from "./lexer";
import { isAndConditionGroup, isBooleanCondition, isBooleanConditionGroup, isBotElement, isValueExpression } from "./generated/type-guards";
import { BooleanConditionBase, BooleanCondition, BooleanConditionGroup, makeOrConditionGroup, makeAndConditionGroup, makeBooleanCondition, makeValueExpression, ValueExpression, BotElement } from "./generated/types"
import { BooleanConditionOperator } from "./generated/enums"
import { structuredConditionToExpression } from "./typedStructuredCondition"

type Token = {
    token_type: string,
    string_repr: string,
}

function isToken(token): token is Token {
    return (token as Token).token_type !== undefined;
}

var currentToken;

function root(get) {
    return logicalOr(get);
}

function logicalOr(get) {
    let child = logicalAnd(get);
    let result = makeOrConditionGroup({'conditions': []});
    if (currentToken.token_type == 'LOGICAL_OR' || currentToken.token_type == 'OR') {
        result.conditions.push(child);
        while (currentToken.token_type == 'LOGICAL_OR' || currentToken.token_type == 'OR') {
            child = logicalAnd(true);
            result.conditions.push(child);
        }
    }

    if (result.conditions.length == 0){
        return isAndConditionGroup(child) ? child : makeAndConditionGroup({'conditions': [child]});
    }
    
    return result;
}

function logicalAnd(get) {
    let child = equality(get);
    let result = makeAndConditionGroup({'conditions': []});
    if (currentToken.token_type == 'LOGICAL_AND' || currentToken.token_type == 'AND') {
        result.conditions.push(child);
        while (currentToken.token_type == 'LOGICAL_AND' || currentToken.token_type == 'AND') {
            child = equality(true);
            result.conditions.push(child);
        }
    }

    return result.conditions.length ? result : child;
}

function equality(get) {
    let left = comparison(get);
    let equalityOperator = null;

    switch (currentToken.token_type) {
        case 'EQUAL': {
            equalityOperator = BooleanConditionOperator.Equal;
            break;
        }
        case 'NOT_EQUAL': {
            equalityOperator = BooleanConditionOperator.NotEqual;
            break;
        }
        default: {
            return left
        }
    }
    
    if (isValueExpression(left) && left.variableReference ) { 
        let rightValue = comparison(true)
        if(!isValueExpression(rightValue as ValueExpression)) {
            throw new Error('Right side of the comparison is not an expression');
        }
        
        return makeBooleanCondition({'variable': left.variableReference, 'operator': equalityOperator, value: rightValue});
    }
    throw new Error('Left side of the comparison is not a variable');
}

function comparison(get) {
    let left = membership(get);
    let comparisonOperator = null;

    switch (currentToken.token_type) {
        case 'LESS_THAN': {
            comparisonOperator = BooleanConditionOperator.Less
            break;
        }
        case 'GREATER_THAN': {
            comparisonOperator = BooleanConditionOperator.Greater
            break;
        }
        case 'LESS_THAN_EQUAL': {
            comparisonOperator = BooleanConditionOperator.LessEqual
            break;
        }
        case 'GREATER_THAN_EQUAL': {
            comparisonOperator = BooleanConditionOperator.GreaterEqual
            break;
        }
        default: {
            return left
        }
    }
    
    if (isValueExpression(left) && left.variableReference ) {
        let rightValue = membership(true);
        if(!isValueExpression(rightValue)) {
            throw new Error('Right side of the comparison is not an expression');
        }

        return makeBooleanCondition({'variable': left.variableReference, 'operator': comparisonOperator, value: rightValue});
    }

    throw new Error('Left side of the comparison is not a variable');
}

function membership(get) {
    let left = expr(get);
    let membershipOperator = null;

    switch (currentToken.token_type) {
        case 'IN': {
            membershipOperator = BooleanConditionOperator.In;
            break;
        }
        case 'EXACTIN': {
            membershipOperator = BooleanConditionOperator.ExactIn;
            break;
        }
        default: {
            return left
        }
    }
    
    if (isBooleanConditionGroup(left as BotElement)){
        return left;
    }

    if (!left.variableReference) {
        throw new Error('Left side of the comparison is not a variable');
    }
    let rightValue = expr(true)
    if(!isValueExpression(rightValue)) {
        throw new Error('Right side of the comparison is not an expression');
    }
    
    return makeBooleanCondition({'variable': left.variableReference, 'operator': membershipOperator, value: rightValue});
}

function expr(get) {
    let left = term(get);
    for (;;) {
        switch (currentToken.token_type) {
            case 'PLUS': {
                left = { token_type: 'expression', string_repr: toStringHelper(left) + ' + ' + toStringHelper(term(true)) };
                break;
            }
            case 'MINUS': {
                left = { token_type: 'expression', string_repr: toStringHelper(left) + ' - ' + toStringHelper(term(true)) };
                break;
            }
            case 'CONCAT': {
                left = { token_type: 'expression', string_repr: toStringHelper(left) + ' & ' + toStringHelper(term(true)) };
                break;
            }
            default: {
                if (isToken(left)) {
                    if (left.token_type == 'variable') {
                        return makeValueExpression({'variableReference': left.string_repr});
                    }
                    return makeValueExpression({'expressionText': left.string_repr})
                }
                if (typeof left === 'boolean' || typeof left === 'number' || typeof left === 'string' ){
                    return makeValueExpression({'literalValue': left});
                }
                return left
            }
        }
    }
}

function term(get) {
    let left = prim(get);
    for (;;) {
        switch (currentToken.token_type) {
            case 'MUL': {
                left = { token_type: 'expression', string_repr: toStringHelper(left) + ' * ' + toStringHelper(prim(true)) };
                break;
            }
            case 'DIV': {
                left = { token_type: 'expression', string_repr: toStringHelper(left) + ' / ' + toStringHelper(prim(true)) };
                break;
            }
            case 'DOT': {
                left = { token_type: 'variable', string_repr: toStringHelper(left) + '.' + toStringHelper(prim(true)) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

function prim(get) {
    let previousToken = null;
    if (get) {
        previousToken = currentToken;
        getToken();
    }
    switch (currentToken.token_type) {
        case 'NUMBER': {
            const v = currentToken.value;
            getToken();
            return Number(v);
        }
        case 'TEXT_LITERAL': {
            const v = currentToken.value;
            getToken();
            return String(v);
        }
        case 'LOGICAL_LITERAL': {
            const v = currentToken.value.toLowerCase();
            getToken();
            return Boolean(v);
        }
        case 'NAME': {
            const name = currentToken.value;
            getToken();
            // function
            if (currentToken.token_type === 'LP') {
                getToken();
                if (currentToken.token_type === 'RP') {
                    getToken();
                    return { token_type: 'function', string_repr: name }
                }
                else {
                    const argumentList = args(false);
                    if (currentToken.token_type !== 'RP') {
                        throw new Error(') expected');
                    }
                    getToken();
                    return { token_type: 'function', string_repr: `${name}(${argumentList})` };
                }
            }
            // variable
            else {
                return { token_type: 'variable', string_repr: name };
            }
        }
        // TODO: Support 'not' 'bang' 'minus'
        case 'NOT':
        case 'BANG': {
            const initialType = currentToken.token_type;
            if (initialType === 'NOT') {
                getToken();
                // function
                if (currentToken.token_type !== 'LP') {
                    throw new Error(`LP expected, received '${currentToken.token_type}'`);
                }
            }
            getToken();
            // function
            if (currentToken.token_type === 'LP') {
                getToken();
                if (currentToken.token_type === 'NAME') {
                    let result = null;
                    switch (currentToken.value) {
                        case 'IsBlank':
                        case 'IsEmpty': {

                            if (initialType === 'NOT' || initialType === 'BANG') {
                                result = makeBooleanCondition({'variable': '', 'operator': BooleanConditionOperator.Equal})
                            } 
                        }
                        default: {

                        }
                    }
                }
                throw new Error(`NAME expected, received '${currentToken.token_type}'`);
            }

            throw new Error(`NAME expected, received '${currentToken.token_type}'`);
        }
        /*
        case 'MINUS': {
            return { token_type: 'primary', match: 'unaryMinus', child: prim(true) };
        }
        */
        case 'LP': {
            const e = root(true);
            if (currentToken.token_type !== 'RP') {
                throw new Error(') expected');
            }
            getToken();
            return e
        }
        case 'EQUAL': {
            if (previousToken === null) {
                let rightValue = comparison(true)
                if(!isValueExpression(rightValue as ValueExpression)) {
                    throw new Error('Right side of the comparison is not an expression');
                }
                return makeBooleanCondition({'variable': '', 'operator': BooleanConditionOperator.Equal, value: rightValue});
            }
            throw new Error(`primary expected, received '${currentToken.token_type}'`);
        }
        case 'END': {
            if (previousToken && previousToken.token_type === 'EQUAL'){
                return makeValueExpression({'literalValue': ""}); 
            }
            throw new Error(`primary expected, received '${currentToken.token_type}'`);
        }
        case 'INVALID': {
            throw new Error(`invalid input token received '${currentToken.value}'`);
        }
        default: {
            throw new Error(`primary expected, received '${currentToken.token_type}'`);
        }
    }
}

function args(get) {
    let argList = structuredConditionToExpression(root(get)).trim();
    for (;;) {
        switch (currentToken.token_type) {
            case 'COMMA': {
                argList += ", " + structuredConditionToExpression(root(true)).trim;
                break;
            }
            default: {
                return argList;
            }
        }
    }
}

function toStringHelper(val): string {
    return typeof val === 'object' ? val.string_repr : String(val);
}

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
        return makeAndConditionGroup({'conditions': []});
    }
    const v = root(false);
    checkForUnconsumedTokens();
    return v;
}

function expressionToStructuredCondition(expression: string): BooleanConditionGroup{
    let t = tokenize(expression);
    let parseTree = evaluate(t);
    //const conditionQueue = [parseTree];
    //let iterator = null;
    //do{
    //    iterator = conditionQueue.shift();
    //}
    //while (iterator.conditions) {
    //    iterator.conditions.forEach((condition) => {
    //        result += expressionToString(condition, isAnd);
    //        if (index != conditionGroup.conditions.length - 1){
    //            result += isAnd ? "&& " : "|| "
    //        }
    //    });
    //}
    return parseTree;
}

export {
    evaluate as eval,
    expressionToStructuredCondition
};
