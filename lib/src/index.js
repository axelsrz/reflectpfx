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
exports.typedStructuredCondition = void 0;
const lexer = __importStar(require("./lexer"));
const parser = __importStar(require("./parser"));
const utils = __importStar(require("./utils"));
const typedStructuredCondition_1 = require("./typedStructuredCondition");
Object.defineProperty(exports, "typedStructuredCondition", { enumerable: true, get: function () { return typedStructuredCondition_1.typedStructuredCondition; } });
//var t = lexer.tokenize('7 && 0');
//var t = lexer.tokenize('f(x, y >= 6)');
//var t = lexer.tokenize('Not Blank()');
//var t = lexer.tokenize('Not(Blank())');
//var t = lexer.tokenize('Table({b:1,a:2},{a:4,b:3})');
//var t = lexer.tokenize('{b:1,a:2}');
//var t = lexer.tokenize('{a:1}');
//var t = lexer.tokenize('a.b');
//var t = lexer.tokenize('a.b.c.d');
//var t = lexer.tokenize('foo().b');
//var t = lexer.tokenize('{ b: 42 }.b');
//var t = lexer.tokenize('a.b.c');
//var t = lexer.tokenize('foo()% * 10 + 2%');
//var t = lexer.tokenize('[1, 2, 3] as X');
//var t = lexer.tokenize('x < y < z < 42');
//var t = lexer.tokenize('Not(IsBlank(1/0))');
//var t = lexer.tokenize('foo(x + y, z, g(h(a, b, c), 42))');
//var t = lexer.tokenize('Topic.A = 5 And Topic.B < 5 * (8 - y) || length(hello & " world") > 15');
//var t = lexer.tokenize('Topic.A = 5 && Topic.B < 5 * (8 - y) || length(hello & " world") > 15');
//var t = lexer.tokenize('');
//var t = lexer.tokenize('2 + 2');
//var t = lexer.tokenize('Not(IsBlank(Topic.A))');
//var t = lexer.tokenize('x < 4 && y + 6 > z || a = 64');
//var t = lexer.tokenize('"hello"');
//var t = lexer.tokenize('(a + b) (c + d)');
//var t = lexer.tokenize('(Topic.A = 1 || Topic.B = 2) && Topic.C = 3');
//var t = lexer.tokenize('Topic.A = 1 || Topic.B = 2 && Topic.C = 3');
//var t = lexer.tokenize('Topic.A + 5 < 7 || Topic.B = 2 && Topic.C = 3');
//var t = lexer.tokenize('Topic.A + 5 < 7 || Topic.B = 2 && Topic.C = 3');
//var t = lexer.tokenize('a = 1 || b = 2 && c = 3');
//var t = lexer.tokenize('a = 2 && (b || c) && (d || e)');
//var t = lexer.tokenize('Topic.A = 1 && Topic.B = 2 && Topic.C = 3 && Topic.D = 4');
//var t = lexer.tokenize('a = 2 && (b + c) * 2 > d');
//var t = lexer.tokenize('a + b * 2');
//var t = lexer.tokenize('a = 1 && (b = 2 || c = 3 || d = 4)');
//var t = lexer.tokenize('(b = 2 || c = 3) && a = 1');
//var t = lexer.tokenize('a = 1 && b = 2 || c = 3');
//var t = lexer.tokenize('a + 32 > b * 2 && foo(b) = 2 || (x + y) * z = 3');
//var t = lexer.tokenize('a = 1 && b = 2 && c = 3 || d = 4');
//var t = lexer.tokenize('a = 1 && (b = 2 || c = 3)');
//var t = lexer.tokenize('(Topic.a = 1 && Topic.b = 2 || Topic.c = 3) && (Topic.a = 1 || Topic.d = 4)');
//var t = lexer.tokenize('(a && b || c) && (d || e)');
//var t = lexer.tokenize('a || b || c || d || e');
//var t = lexer.tokenize('a && b && c || d && e');
//var t = lexer.tokenize('a = 1 && b = 2 && c = 3 || d = 4');
//var t = lexer.tokenize('d = 4 || a = 1 && b = 2 && c = 3');
//var t = lexer.tokenize('a || b && c && d || e && f');
//var t = lexer.tokenize('a && b && c && d && e && f && (g || h)');
//var t = lexer.tokenize('a = 1 and b = 2 and c = 3 || d = 4');
//var t = lexer.tokenize('a');
//var t = lexer.tokenize('x & $"text1{x + y}text2{"hello" & $" {userName} "}text3" & y');
//var t = lexer.tokenize('x + y * z');
//var t = lexer.tokenize('x & $"text1{"hello " & $" {name} "}text2" & y');
//var t = lexer.tokenize('$"text1{x + y}text2{expr2}text3"');
//var t = lexer.tokenize('$"Hello {"World!"}"');
//var t = lexer.tokenize('$""');
//var t = lexer.tokenize('$"! { {a:1,b:2} } !"');
//typedStructuredCondition('a = 1 && (b = 2 || c = 3 || d = 4)')
//var t = lexer.tokenize('a = 1 && (b = 2 || c = 3 || d = 4 && e = 5)');
var t = lexer.tokenize("Topic.A = 5");
//var t = lexer.tokenize('$"{Hello} "');
//t.forEach(function(token) { console.log(`${token.type} ${token.value}`); });
var parseTree = parser.eval(t);
//let structCondition = binaryToNary(parseTree, ['logicalAnd', 'logicalOr'], true);
let structCondition = (0, typedStructuredCondition_1.typedStructuredCondition)('Topic.A = 5.5');
if (parseTree === undefined) {
    throw new Error('eval returned undefined');
}
console.log(JSON.stringify(parseTree, null, 2));
console.log();
console.log(utils.toString(parseTree));
