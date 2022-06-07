import { tokenize } from "./lexer";
import { BooleanConditionBase, BooleanCondition, BooleanConditionGroup, makeOrConditionGroup, makeAndConditionGroup, makeBooleanCondition, makeValueExpression, ValueExpression } from "./generated/types"
import { BooleanConditionOperator } from "./generated/enums"
import { eval } from "./parser";
import { BotElementKind } from "./generated/kinds";
import { isBooleanCondition, isBooleanConditionGroup, isValueExpression } from "./generated/type-guards";

class StructuredConditionParsingError extends Error {
    constructor(message) {
      super(message);
      this.name = "StructuredConditionParsingError";
    }
}

function typedStructuredCondition(expression: string): BooleanConditionGroup {
    let t = tokenize(expression);
    let parseTree = eval(t)
    let result = null;
    try {
        result = binaryToNary(parseTree, ['logicalAnd', 'logicalOr'], true);
        if (result.$kind != BotElementKind.OrConditionGroup && result.$kind != BotElementKind.AndConditionGroup) {
            result = makeAndConditionGroup({'conditions': [result]});
        }
    } catch (err) {
        if (err instanceof StructuredConditionParsingError) {
            alert("Error while parsing StructuredCondition: " + err.message); // Invalid data: No field: name
        }
        else {
            throw err
        }
    }
    
    return result;
}

function structuredConditionToExpression(condition: BooleanConditionGroup): string {
    return stringifyConditionGroup(condition, false);
}

function expressionToString(expression: any, parentIsAnd: boolean = false): string {
    if (expression == null) {
        return "";
    }
    switch (typeof(expression)){
        case "number":
        case "boolean":
            return String(expression) + " ";
        case "string":
            return expression + " ";
        case "object":
            if (isBooleanConditionGroup(expression)){
                return stringifyConditionGroup(expression, parentIsAnd);
            }
            if (isValueExpression(expression)){
                return stringifyValueExpression(expression);
            }
            if (isBooleanCondition(expression)){
                return stringifyCondition(expression);
            }
    }
    throw new StructuredConditionParsingError("Expression type not recognized");
}

function stringifyValueExpression(valueExpression: ValueExpression): string {
    const result = valueExpression.expressionText || valueExpression.variableReference || String(valueExpression.literalValue);

    return result + " ";
}

function stringifyCondition(condition: BooleanCondition): string {
    let operator = "";
    switch (condition.operator) {
        case BooleanConditionOperator.Equal:
            operator = "= ";
            break;
        case BooleanConditionOperator.NotEqual:
            operator = "<> ";
            break;
        case BooleanConditionOperator.Greater:
            operator = "< ";
            break;
        case BooleanConditionOperator.GreaterEqual:
            operator = "<= ";
            break;
        case BooleanConditionOperator.Less:
            operator = "> ";
            break;
        case BooleanConditionOperator.LessEqual:
            operator = ">= ";
            break;
    }
    return twoArguments(operator, condition.variable, condition.value);
}

function stringifyConditionGroup(conditionGroup: BooleanConditionGroup, parentIsAnd: boolean): string {
    let result = "";
    if (typeof conditionGroup === 'undefined' || conditionGroup === null || conditionGroup.conditions.length == 0) {
        return result;
    }
    const isAnd = conditionGroup.$kind == BotElementKind.AndConditionGroup;
    const insertParenthesis = parentIsAnd && !isAnd;
    if(conditionGroup.conditions.length == 1){
        return expressionToString(conditionGroup.conditions[0]);
    }

    if (insertParenthesis){
        result += "( ";
    }
    conditionGroup.conditions.forEach((condition, index) => {
        result += expressionToString(condition, isAnd);
        if (index != conditionGroup.conditions.length - 1){
            result += isAnd ? "&& " : "|| "
        }
    });
    if (insertParenthesis){
        result += ") ";
    }

    return result.trim();
}

function twoArguments(operator: string, left, right): string {
    return expressionToString(left) + operator + expressionToString(right);
}

function extractChildrenNodes(treeNode){
    const result = [];
    if (treeNode.child){
        result.push(treeNode.child)
        delete treeNode.child
    } else{
        if (treeNode.left){
            result.push(treeNode.left)
            delete treeNode.left
        }
        if (treeNode.right){
            result.push(treeNode.right)
            delete treeNode.right
        }
    }
    return result
}

function binaryToNary(bNode, exclusiveOperatorsToFlatten: string[] = null, removeParenthesis: boolean = false): BooleanConditionBase {
    if (!bNode) return null;
    let leaves = extractChildrenNodes(bNode);
    bNode.children = []
    leaves.forEach(element => {
        if(!element) return;
        var flatNode = binaryToNary(element, exclusiveOperatorsToFlatten, removeParenthesis);
        if(!flatNode) return;
        if (operatorsShouldBeFlatten(element.token_type, bNode.token_type, exclusiveOperatorsToFlatten)){
            //TODO: This code assumes only condition groups can be flattened, make it more generic.
            bNode.children.push(...(flatNode as BooleanConditionGroup).conditions);
        }
        else {
            bNode.children.push(flatNode);
        }
    });

    let nodeToReturn = (removeParenthesis && bNode.token_type == 'primary' && bNode.match == 'parenthesis' ? bNode.children[0] || null : castNodeToStructuredCondition(bNode))
    return nodeToReturn;
}

function operatorsShouldBeFlatten(current_token_type: any, child_token_type: any, exclusiveOperatorsToFlatten: string[]): boolean {
    if (current_token_type != child_token_type) {
        return false;
    }
    else if(!exclusiveOperatorsToFlatten || exclusiveOperatorsToFlatten.length == 0) {
        return true;
    }

    return exclusiveOperatorsToFlatten.includes(current_token_type);
}

function castNodeToStructuredCondition(bNode: any) {
    switch (bNode.token_type){
        case 'logicalOr':
            return makeOrConditionGroup({'conditions': bNode.children});
        case 'logicalAnd':
            return makeAndConditionGroup({'conditions': bNode.children});
        case 'equality':
            let rightValue = makeValueExpression({'literalValue': bNode.children[1]});
            let equalityOperator = bNode.operator == '=' ? BooleanConditionOperator.Equal : BooleanConditionOperator.NotEqual;
            if (typeof(bNode.children[0]) !== "string") {
                throw new StructuredConditionParsingError("Left side of the comparison is not a variable")
            }
            return makeBooleanCondition({'variable': bNode.children[0], 'operator': equalityOperator, value: rightValue});
        case 'term':
            switch (bNode.operator) {
                case '.':
                    let typeLeft =  typeof(bNode.children[0]);
                    let typeRight =  typeof(bNode.children[1]);
                    if (typeLeft == typeRight){
                        if(typeLeft === "number"){
                            return Number(bNode.children[0]+"."+bNode.children[1]);
                        }
                        else if(typeLeft === "string"){
                            return bNode.children[0]+"."+bNode.children[1];
                        }
                        throw new StructuredConditionParsingError('Children for DOT operator are from an unhandled type');
                    }
                    throw new StructuredConditionParsingError('Children for DOT operator are not the same type');
            }
            return
        case 'primary':
            switch (bNode.match){
                case 'logical_literal':
                    return bNode.value;
                case 'variable':
                    return bNode.name;
                case 'number':
                    return Number(bNode.value);
            }
    }
    return null
}


export{
    structuredConditionToExpression,
    typedStructuredCondition,
    binaryToNary
}
