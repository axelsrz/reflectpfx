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
exports.log = exports.tokenize = void 0;
const stringInterpolation = __importStar(require("./stringInterpolation"));
// like UNIX lex this lexer evaluates an ordered set of regular expressions
// against the input, unlike UNIX lex it's not executing program fragments
// instead it is just returning an array of tokens containing the matching text
// http://dinosaur.compilertools.net/lex/index.html
// fun fact: the co-author of lex was Eric Schmidt (when he was an intern at Bell Labs before he ran Google)
// note NUMBER can be the subject of localization because of decimal separator
const tokenTypes = {
    COMMENT: /((\/\*)(.|[\r\n])*?(\*\/))|(\/\/.*)/,
    WS: /\s+/,
    PLUS: /\+/,
    MINUS: /\-/,
    MUL: /\*/,
    DIV: /\//,
    LP: /\(/,
    RP: /\)/,
    CLP: /\{/,
    CRP: /\}/,
    COLON: /\:/,
    SLP: /\[/,
    SRP: /\]/,
    PERCENT: /\%/,
    COMMA: /\,/,
    NUMBER: /\d*\.?\d+([eE][+-]?\d+)?/,
    EQUAL: /\=/,
    BANG: /\!/,
    NOT_EQUAL: /\<\>/,
    LESS_THAN_EQUAL: /\<\=/,
    GREATER_THAN_EQUAL: /\>\=/,
    LESS_THAN: /\</,
    GREATER_THAN: /\>/,
    DOT: /\./,
    LOGICAL_AND: /\&\&/,
    LOGICAL_OR: /\|\|/,
    CONCAT: /\&/,
    POWER: /\^/,
    DISAMBIGUATION: /\@/,
    BEGIN_STRING_INTERPOLATION: /\$"/,
    TEXT_LITERAL: /"{1}([^"]|"{2})*"{1}/,
    NAME: /[a-zA-Z][a-zA-Z0-9]*/,
    INVALID: /./
};
const keywords = {
    in: "IN",
    exactin: "EXACTIN",
    and: "AND",
    or: "OR",
    not: "NOT",
    true: "LOGICAL_LITERAL",
    false: "LOGICAL_LITERAL",
    as: 'AS'
};
function nextToken(s) {
    let match = { token_type: 'END', value: null, index: null };
    for (var tokenType in tokenTypes) {
        const result = tokenTypes[tokenType].exec(s);
        if (result !== null) {
            if (result.index === 0) {
                match = { token_type: tokenType, value: result[0], index: null };
                break;
            }
        }
    }
    if (match.token_type === 'NAME') {
        const keywordType = keywords[match.value.toLowerCase()];
        if (keywordType !== undefined) {
            match.token_type = keywordType;
        }
    }
    return match;
}
function processStringInterpolation(s, token) {
    function literal(s) {
        if (s.length > 0) {
            tokens.push({ token_type: 'SEGMENT_TEXT_LITERAL', value: s });
            tokens.push({ token_type: 'STRING_INTERPOLATION_SEPARATOR', value: '' });
        }
    }
    function expression(s) {
        const nestedTokens = tokenize(s);
        nestedTokens.pop();
        tokens.push(...nestedTokens);
        tokens.push({ token_type: 'STRING_INTERPOLATION_SEPARATOR', value: '' });
    }
    const tokens = [];
    tokens.push(token);
    const indexStart = stringInterpolation.read(s, token.index + token.value.length, literal, expression);
    if (tokens.length > 1) {
        tokens.pop();
    }
    tokens.push({ token_type: 'END_STRING_INTERPOLATION', value: '' });
    return { indexStart: indexStart, tokens: tokens };
}
function tokenize(s) {
    let indexStart = 0;
    const tokens = [];
    for (;;) {
        const token = nextToken(s.substring(indexStart));
        token.index = indexStart;
        if (token.token_type === 'BEGIN_STRING_INTERPOLATION') {
            var stringInterpolationResult = processStringInterpolation(s, token);
            indexStart = stringInterpolationResult.indexStart;
            tokens.push(...stringInterpolationResult.tokens);
        }
        else {
            tokens.push(token);
            if (token.token_type === 'END') {
                break;
            }
            indexStart += token.value.length;
        }
    }
    return tokens;
}
exports.tokenize = tokenize;
function log(tokens) {
    tokens.forEach(function (token) {
        console.log(`${token.token_type} ${token.value} ${token.index}`);
    });
}
exports.log = log;
