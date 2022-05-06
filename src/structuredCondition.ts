
import * as utils from "./utils";
import * as nary from "./nary";
import {postfix} from "./postfix";

function normalizeOperator(original) {
    const lookup = { and: '&&', or: '||', '&&': '&&', '||': '||' };
    return lookup[original.trim().toLowerCase()];
}

function traverseNonTerminal(node) {
    var result = {left: null, right: null, operator: null};
    if (node.left) {
        result.left = traverse(node.left);
        result.operator = normalizeOperator(node.operator);
    }
    result.right = traverse(node.right);
    return result;
}

function traverse(node) {
    switch (node.type) {
        case 'logicalOr':
        case 'logicalAnd': {
            return traverseNonTerminal(node);
        }
        case 'primary': {
            if (node.match === 'parenthesis' && (node.child.type === 'logicalOr' || node.child.type === 'logicalAnd')) {
                return traverse(node.child);
            }
            else {
                return { expression: utils.toString(node) };
            }
        }
        default: {
            return { expression: utils.toString(node) };
        }
    }
}

function makeStructuredConditionTree(parseTree) {
    return traverse(parseTree);
}

function structuredCondition(parseTree) {
    // extract the structured condition binary tree from the parse tree 
    var structuredConditionTree = makeStructuredConditionTree(parseTree);

    // starting to think this conversion to postfix and further manipulation is nonsense...

    // convert to postfix - experimenting whether manipulating the postfix is cleaner
    var structuredConditionPostFix = postfix(structuredConditionTree);

    // the postfix was still binary operators, so first convert them to n-ary operators
    var structuredConditionPostFixNary = nary.makeNaryPostFix(structuredConditionPostFix);

    // build a n-ary tree from the n-ary postfix representation
    return nary.makeTree(structuredConditionPostFixNary);
}

export {
    structuredCondition,

    // export this for testing
    makeStructuredConditionTree,
};
