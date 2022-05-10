import { BotElement, PropertyPath } from "./types";

export interface ExpressionBase<T> extends BotElement
{
    /**
     * Represents the formula that resolves to the expected value. When this is set, LiteralValue and VariableReference will not have a value.
     */
    expressionText?: string;

    /**
     * Represents a reference to an variable. When this is set, LiteralValue and ExpressionText will not have a value.
     */
    variableReference?: PropertyPath;

    literalValue?: T;
}