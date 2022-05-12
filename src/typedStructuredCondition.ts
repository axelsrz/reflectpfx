import { tokenize } from "./lexer";
import { BooleanConditionBase, BooleanConditionGroup, makeOrConditionGroup, makeAndConditionGroup, makeBooleanCondition, makeValueExpression } from "./generated/types"
import { BooleanConditionOperator } from "./generated/enums"
import { eval } from "./parser";
import { structuredCondition } from "./structuredCondition";

function typedStructuredCondition(expression: string): BooleanConditionBase {
    let t = tokenize(expression);
    let parseTree = eval(t)
    let structuredConditionTree = structuredCondition(parseTree)
    return structuredConditionTree;
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
            return makeBooleanCondition({'variable': String(bNode.children[0]), 'operator': BooleanConditionOperator.Equal, value: rightValue})
        case 'primary':
            switch (bNode.match){
                case 'variable':
                    return bNode.name;
                case 'number':
                    return Number(bNode.value);
            }
    }
    return null
}


export{
    typedStructuredCondition,
    binaryToNary
}
