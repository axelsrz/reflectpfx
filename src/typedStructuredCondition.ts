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

function castingTraverse(parseTree): BooleanConditionBase {

    return null
}


export{
    typedStructuredCondition
}
