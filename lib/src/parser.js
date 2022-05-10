// This top down parser was originally verbatim from Bjarne Stroupstrup's example in
// "The C++ Programming Language Third Edition" section 6.1.1 page 108.
// The operator precedence here, where it corresponds, follow that described on page 120 of the same book.
var currentToken;
function root(get) {
    return logicalOr(get);
}
function logicalOr(get) {
    var left = logicalAnd(get);
    for (;;) {
        switch (currentToken.type) {
            case 'LOGICAL_OR': {
                left = { type: 'logicalOr', operator: '||', left: left, right: logicalAnd(true) };
                break;
            }
            case 'OR': {
                left = { type: 'logicalOr', operator: ' Or ', left: left, right: logicalAnd(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function logicalAnd(get) {
    var left = equality(get);
    for (;;) {
        switch (currentToken.type) {
            case 'LOGICAL_AND': {
                left = { type: 'logicalAnd', operator: '&&', left: left, right: equality(true) };
                break;
            }
            case 'AND': {
                left = { type: 'logicalAnd', operator: ' And ', left: left, right: equality(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function equality(get) {
    var left = comparison(get);
    for (;;) {
        switch (currentToken.type) {
            case 'EQUAL': {
                left = { type: 'equality', operator: '=', left: left, right: comparison(true) };
                break;
            }
            case 'NOT_EQUAL': {
                left = { type: 'equality', operator: '<>', left: left, right: comparison(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function comparison(get) {
    var left = membership(get);
    for (;;) {
        switch (currentToken.type) {
            case 'LESS_THAN': {
                left = { type: 'comparison', operator: '<', left: left, right: membership(true) };
                break;
            }
            case 'GREATER_THAN': {
                left = { type: 'comparison', operator: '>', left: left, right: membership(true) };
                break;
            }
            case 'LESS_THAN_EQUAL': {
                left = { type: 'comparison', operator: '<=', left: left, right: membership(true) };
                break;
            }
            case 'GREATER_THAN_EQUAL': {
                left = { type: 'comparison', operator: '>=', left: left, right: membership(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function membership(get) {
    var left = expr(get);
    for (;;) {
        switch (currentToken.type) {
            case 'IN': {
                left = { type: 'membership', operator: ' In ', left: left, right: expr(true) };
                break;
            }
            case 'EXACTIN': {
                left = { type: 'membership', operator: ' ExactIn ', left: left, right: expr(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function expr(get) {
    var left = term(get);
    for (;;) {
        switch (currentToken.type) {
            case 'PLUS': {
                left = { type: 'expression', operator: '+', left: left, right: term(true) };
                break;
            }
            case 'MINUS': {
                left = { type: 'expression', operator: '-', left: left, right: term(true) };
                break;
            }
            case 'CONCAT': {
                left = { type: 'expression', operator: '&', left: left, right: term(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}
function term(get) {
    var left = prim(get);
    for (;;) {
        switch (currentToken.type) {
            case 'MUL': {
                left = { type: 'term', operator: '*', left: left, right: prim(true) };
                break;
            }
            case 'DIV': {
                left = { type: 'term', operator: '/', left: left, right: prim(true) };
                break;
            }
            case 'DOT': {
                left = { type: 'term', operator: '.', left: left, right: prim(true) };
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
    switch (currentToken.type) {
        case 'NUMBER': {
            var v = currentToken.value;
            getToken();
            return postFix({ type: 'primary', match: 'number', value: v });
        }
        case 'TEXT_LITERAL': {
            var v = currentToken.value;
            getToken();
            return { type: 'primary', match: 'text_literal', value: v };
        }
        case 'SEGMENT_TEXT_LITERAL': {
            var v = currentToken.value;
            getToken();
            return { type: 'primary', match: 'segment_text_literal', value: v };
        }
        case 'BEGIN_STRING_INTERPOLATION': {
            var child = stringInterpolation();
            getToken();
            return { type: 'primary', match: 'string_interpolation', child: child };
        }
        case 'END_STRING_INTERPOLATION': {
            getToken();
            return { type: 'primary', match: 'segment_empty_expression' };
        }
        case 'LOGICAL_LITERAL': {
            var v = currentToken.value.toLowerCase();
            getToken();
            return { type: 'primary', match: 'logical_literal', value: v };
        }
        case 'NAME': {
            var name_1 = currentToken.value;
            getToken();
            // function
            if (currentToken.type === 'LP') {
                getToken();
                if (currentToken.type === 'RP') {
                    getToken();
                    return postFix({ type: 'primary', match: 'function', name: name_1 });
                }
                else {
                    var argumentList_1 = args(false);
                    if (currentToken.type !== 'RP') {
                        throw new Error(') expected');
                    }
                    getToken();
                    return postFix({ type: 'primary', match: 'function', name: name_1, args: argumentList_1 });
                }
            }
            // variable
            else {
                return postFix({ type: 'primary', match: 'variable', name: name_1 });
            }
        }
        case 'AND': {
            var name_2 = currentToken.value;
            getToken();
            if (currentToken.type === 'LP') {
                getToken();
                if (currentToken.type === 'RP') {
                    getToken();
                    return { type: 'primary', match: 'and', name: name_2 };
                }
                else {
                    var argumentList = args(false);
                    if (currentToken.type !== 'RP') {
                        throw new Error(') expected');
                    }
                    getToken();
                    return { type: 'primary', match: 'and', name: name_2, args: argumentList };
                }
            }
            break;
        }
        case 'OR': {
            var name_3 = currentToken.value;
            getToken();
            if (currentToken.type === 'LP') {
                getToken();
                if (currentToken.type === 'RP') {
                    getToken();
                    return { type: 'primary', match: 'or', name: name_3 };
                }
                else {
                    var argumentList = args(false);
                    if (currentToken.type !== 'RP') {
                        throw new Error(') expected');
                    }
                    getToken();
                    return { type: 'primary', match: 'or', name: name_3, args: argumentList };
                }
            }
            break;
        }
        case 'NOT': {
            return { type: 'primary', match: 'not', child: prim(true) };
        }
        case 'BANG': {
            return { type: 'primary', match: 'bang', child: prim(true) };
        }
        case 'MINUS': {
            return { type: 'primary', match: 'unaryMinus', child: prim(true) };
        }
        case 'LP': {
            var e = root(true);
            if (currentToken.type !== 'RP') {
                throw new Error(') expected');
            }
            getToken();
            return postFix({ type: 'primary', match: 'parenthesis', child: e });
        }
        case 'SLP': {
            getToken();
            if (currentToken.type === 'SRP') {
                getToken();
                return postFix({ type: 'primary', match: 'inlineTable' });
            }
            else {
                var argumentList_2 = args(false);
                if (currentToken.type !== 'SRP') {
                    throw new Error('] expected');
                }
                getToken();
                return postFix({ type: 'primary', match: 'inlineTable', args: argumentList_2 });
            }
        }
        case 'CLP': {
            getToken();
            if (currentToken.type === 'CRP') {
                getToken();
                return { type: 'primary', match: 'inlineRecord' };
            }
            else {
                var r = records(false);
                if (currentToken.type !== 'CRP') {
                    throw new Error('} expected');
                }
                getToken();
                return { type: 'primary', match: 'inlineRecord', records: r };
            }
        }
        case 'INVALID': {
            throw new Error("invalid input token received '" + currentToken.value + "'");
        }
        default: {
            throw new Error("primary expected, received '" + currentToken.type + "'");
        }
    }
}
function postFix(primary) {
    if (currentToken.type === 'PERCENT') {
        getToken();
        return { type: 'primary', match: 'percent', child: primary };
    }
    else if (currentToken.type === 'AS') {
        getToken();
        if (currentToken.type !== 'NAME') {
            throw new Error('name expected following as operator');
        }
        var name_4 = currentToken.value;
        getToken();
        return { type: 'primary', match: 'as', name: name_4, child: primary };
    }
    return primary;
}
function args(get) {
    var left = { type: 'args', right: root(get) };
    for (;;) {
        switch (currentToken.type) {
            case 'COMMA': {
                left = { type: 'args', left: left, right: root(true) };
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
    if (currentToken.type !== 'NAME') {
        throw new Error('name expected in record');
    }
    var name = currentToken.value;
    getToken();
    if (currentToken.type !== 'COLON') {
        throw new Error(': expected in record');
    }
    var left = { type: 'record', name: name, right: root(true) };
    for (;;) {
        switch (currentToken.type) {
            case 'COMMA': {
                getToken();
                if (currentToken.type !== 'NAME') {
                    throw new Error('name expected in record');
                }
                var name_5 = currentToken.value;
                getToken();
                if (currentToken.type !== 'COLON') {
                    throw new Error(': expected in record');
                }
                left = { type: 'record', left: left, name: name_5, right: root(true) };
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
    if (currentToken.type === 'END_STRING_INTERPOLATION') {
        return undefined;
    }
    var left = { type: 'stringInterpolation', right: root(false) };
    for (;;) {
        switch (currentToken.type) {
            case 'STRING_INTERPOLATION_SEPARATOR': {
                left = { type: 'stringInterpolation', left: left, right: root(true) };
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
var tokens;
var index;
function getToken() {
    if (currentToken && currentToken.type === 'END') {
        return;
    }
    // skip whitespace and comments - alternatively we could use array filter
    var token = tokens[index++];
    if (token.type === 'WS' || token.type === 'COMMENT') {
        token = tokens[index++];
    }
    currentToken = token;
}
function checkForUnconsumedTokens() {
    for (;;) {
        if (currentToken && currentToken.type === 'END') {
            break;
        }
        if (currentToken.type !== 'WS' && currentToken.type !== 'COMMENT') {
            throw new Error("unconsumed input token " + currentToken.type + " " + currentToken.value);
        }
        getToken();
    }
}
function evaluate(t) {
    tokens = t;
    index = 0;
    currentToken = undefined;
    getToken();
    if (currentToken && currentToken.type === 'END') {
        return undefined;
    }
    var v = root(false);
    checkForUnconsumedTokens();
    return v;
}
function evalNary(t) {
    var binaryTree = evaluate(t);
    var naryTree = binaryToNary(binaryTree);
    return naryTree;
}
function extractChildrenNodes(treeNode) {
    var result = [];
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
    leaves.forEach(function (element) {
        var _a;
        if (!element)
            return;
        var flatNode = binaryToNary(element);
        if (element.type != bNode.type) {
            bNode.children.push(flatNode);
        }
        else {
            (_a = bNode.children).push.apply(_a, flatNode.children);
        }
    });
    return bNode;
}
export { evaluate as eval, evalNary };
//# sourceMappingURL=parser.js.map