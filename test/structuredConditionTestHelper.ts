import { expect } from 'chai';
import {expressionToStructuredCondition} from '../src/index';
import { AndConditionGroup, BooleanConditionGroup, BooleanCondition, BooleanConditionBase, OrConditionGroup, makeAndConditionGroup, makeBooleanCondition, makeOrConditionGroup, makeValueExpression } from "../src/generated/types";
import { BooleanConditionOperator } from "../src/generated/enums"
import { structuredCondition } from '../src/structuredCondition';


function assertStructuredCondition(original: string, expected: BooleanConditionGroup) {
    const sut = expressionToStructuredCondition(original)
    expect(sut).to.eql(expected)
}

function and(...conditions: BooleanConditionBase[]): AndConditionGroup {
    return makeAndConditionGroup({'conditions': conditions});
}

function or(...conditions: BooleanConditionBase[]): OrConditionGroup {
    return makeOrConditionGroup({'conditions': conditions});
}

function condition(variable: string, operator: BooleanConditionOperator, value: any): BooleanCondition {
    return makeBooleanCondition({'variable': variable, 'operator': operator, value: makeValueExpression({'literalValue': value})});
}

function unaryCondition(variable: string, operator: BooleanConditionOperator): BooleanCondition {
    return makeBooleanCondition({'variable': variable, 'operator': operator});
}

function conditionTwoVariables(variable: string, operator: BooleanConditionOperator, secondVariable: any): BooleanCondition {
    return makeBooleanCondition({'variable': variable, 'operator': operator, value: makeValueExpression({'variableReference': secondVariable})});
}


export { assertStructuredCondition, and, condition, conditionTwoVariables, or, unaryCondition }