import { tokenize } from "./lexer";
import { BooleanConditionBase } from "./generated/types"
import { eval } from "./parser";
import { structuredCondition } from "./structuredCondition";

function typedStructuredCondition(expression: string): BooleanConditionBase {
    let t = tokenize(expression);
    let parseTree = eval(t)
    let structuredConditionTree = structuredCondition(parseTree)
    return castingTraverse(structuredConditionTree);
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

function binaryToNary(bNode, exclusiveOperatorsToFlatten: string[] = null) {
    if (!bNode) return null;
    let leaves = extractChildrenNodes(bNode);
    bNode.children = []
    leaves.forEach(element => {
        if(!element) return;
        var flatNode = binaryToNary(element);
        if (operatorsShouldBeFlatten(element.token_type, bNode.token_type, exclusiveOperatorsToFlatten)){
            bNode.children.push(...flatNode.children);
        }
        else {
            bNode.children.push(flatNode);
        }
    });
    return bNode;
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



function castingTraverse(parseTree): BooleanConditionBase {
    return null
}


export{
    typedStructuredCondition,
    binaryToNary
}
