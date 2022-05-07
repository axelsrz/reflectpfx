"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeStructuredConditionTree = exports.structuredCondition = void 0;
const utils = __importStar(require("./utils"));
const nary = __importStar(require("./nary"));
const postfix_1 = require("./postfix");
function normalizeOperator(original) {
    const lookup = { and: '&&', or: '||', '&&': '&&', '||': '||' };
    return lookup[original.trim().toLowerCase()];
}
function traverseNonTerminal(node) {
    var result = { left: null, right: null, operator: null };
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
exports.makeStructuredConditionTree = makeStructuredConditionTree;
function structuredCondition(parseTree) {
    // extract the structured condition binary tree from the parse tree 
    var structuredConditionTree = makeStructuredConditionTree(parseTree);
    // starting to think this conversion to postfix and further manipulation is nonsense...
    // convert to postfix - experimenting whether manipulating the postfix is cleaner
    var structuredConditionPostFix = (0, postfix_1.postfix)(structuredConditionTree);
    // the postfix was still binary operators, so first convert them to n-ary operators
    var structuredConditionPostFixNary = nary.makeNaryPostFix(structuredConditionPostFix);
    // build a n-ary tree from the n-ary postfix representation
    return nary.makeTree(structuredConditionPostFixNary);
}
exports.structuredCondition = structuredCondition;
