import {assertStructuredCondition, and, condition, conditionTwoVariables, or, unaryCondition} from './structuredConditionTestHelper';
import { BooleanConditionOperator } from "../src/generated/enums"

const { Equal, Greater, GreaterEqual, Less, LessEqual, NotEqual, In, ExactIn, IsBlank, IsNotBlank, IsEmpty, IsNotEmpty } = BooleanConditionOperator;

describe('StructuredConditionParser', function() {
    it(`Topic.A = 5`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', Equal, 5))) });
    it(`Topic.A > 5`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', Greater, 5))) });
    it(`Topic.A >= 5`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', GreaterEqual, 5))) });
    it(`Topic.A < 5`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', Less, 5))) });
    it(`Topic.A <= 5`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', LessEqual, 5))) });
    it(`Topic.A <> 5`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', NotEqual, 5))) });
    it(`Topic.'1B' <> 5`, function() { assertStructuredCondition(this.test.title, and(condition(`Topic.'1B'`, NotEqual, 5))) });
    it(`Topic.A in "XA"`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', In, `"XA"`))) });
    //it(`IsBlank(Topic.A)`, function() { assertStructuredCondition(this.test.title, and(unaryCondition('Topic.A', IsBlank))) });
    //it(`Not(IsBlank(Topic.A))`, function() { assertStructuredCondition(this.test.title, and(unaryCondition('Topic.A', IsNotBlank))) });
    //it(`!IsBlank(Topic.A)`, function() { assertStructuredCondition(this.test.title, and(unaryCondition('Topic.A', IsNotBlank))) });
    //it(`IsEmpty(Topic.A)`, function() { assertStructuredCondition(this.test.title, and(unaryCondition('Topic.A', IsEmpty))) });
    //it(`Not(IsEmpty(Topic.A))`, function() { assertStructuredCondition(this.test.title, and(unaryCondition('Topic.A', IsNotEmpty))) });
    //it(`!IsEmpty(Topic.A)`, function() { assertStructuredCondition(this.test.title, and(unaryCondition('Topic.A', IsNotEmpty))) });
    it(`Topic.A = 5 || Topic.B = 5`, function() { assertStructuredCondition(this.test.title, or(condition('Topic.A', Equal, 5), condition('Topic.B', Equal, 5))) });
    //it(`IsEmpty(Topic.A) || !IsEmpty(Topic.B)`, function() { assertStructuredCondition(this.test.title, or(unaryCondition('Topic.A', IsEmpty), unaryCondition('Topic.B', IsNotEmpty))) });
    it(`Topic.A = 5 && Topic.B = 5`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', Equal, 5), condition('Topic.B', Equal, 5))) });
    it(`Topic.A = 5 Or Topic.B = 5`, function() { assertStructuredCondition(this.test.title, or(condition('Topic.A', Equal, 5), condition('Topic.B', Equal, 5))) });
    it(`Topic.A = 5 And Topic.B = 5`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', Equal, 5), condition('Topic.B', Equal, 5))) });
    it(`Topic.A = Foo.Bar And Topic.B = Foo.Bar`, function() { assertStructuredCondition(this.test.title, and(conditionTwoVariables('Topic.A', Equal, 'Foo.Bar'), conditionTwoVariables('Topic.B', Equal, 'Foo.Bar'))) });
    it(`Topic.A = Foo.'1 Bar' And Topic.B = Foo.'2 Bar'`, function() { assertStructuredCondition(this.test.title, and(conditionTwoVariables('Topic.A', Equal, `Foo.'1 Bar'`), conditionTwoVariables('Topic.B', Equal, `Foo.'2 Bar'`))) });
    it(`Topic.A = 5 Or Topic.B = 5 Or Topic.C = 5`, function() { assertStructuredCondition(this.test.title, or(condition('Topic.A', Equal, 5), condition('Topic.B', Equal, 5), condition('Topic.C', Equal, 5))) });
    it(`Topic.A = 5 And Topic.B = 5 And Topic.C = 5`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', Equal, 5), condition('Topic.B', Equal, 5), condition('Topic.C', Equal, 5))) });
    it(`Topic.A = 5 Or Topic.B = 5 And Topic.C = 5`, function() { assertStructuredCondition(this.test.title, or(condition('Topic.A', Equal, 5), and(condition('Topic.B', Equal, 5), condition('Topic.C', Equal, 5)))) });
    it(`Topic.A = 5 And Topic.B = 5 Or Topic.C = 5`, function() { assertStructuredCondition(this.test.title, or(and(condition('Topic.A', Equal, 5), condition('Topic.B', Equal, 5)), condition('Topic.C', Equal, 5))) });
    it(`(Topic.A = 5 Or Topic.B = 5) And Topic.C = 5`, function() { assertStructuredCondition(this.test.title, and(or(condition('Topic.A', Equal, 5), condition('Topic.B', Equal, 5)), condition('Topic.C', Equal, 5))) });
    it(`Topic/*hi*/.A = 5`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', Equal, 5))) });
    it(`/*hi*/Topic.A = 5`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', Equal, 5))) });
    it(`Topic.A = 5/*hi*/`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', Equal, 5))) });
    it(`Topic.A = 5 // hi`, function() { assertStructuredCondition(this.test.title, and(condition('Topic.A', Equal, 5))) });
    it(`Topic.A = Topic.B`, function() { assertStructuredCondition(this.test.title, and(conditionTwoVariables('Topic.A', Equal, 'Topic.B'))) });
});
