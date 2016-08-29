var chai = require('chai');
var expect = chai.expect;

var ExpressionRuleEngine = require('../../src/expression-rule-engine');

var testData = {
    validExpression: {
        input: 'a + b',
        output: {
            convertedASTTokens: {
                "validExpression": true,
                "expression": "a + b",
                "modifiedExpression": "",
                "hasVariable": true,
                "expressionTree": {
                    "type": "BinaryExpression",
                    "operator": "+",
                    "left": {
                        "type": "Identifier",
                        "name": "a"
                    },
                    "right": {
                        "type": "Identifier",
                        "name": "b"
                    }
                },
                "variables": [
                    "a",
                    "b"
                ],
                "error": {}
            }
        }
    },
    invalidExpression: {
        input: 'a + ',
        output: {
            convertedASTTokens: {
                "validExpression": false,
                "expression": "a + ",
                "modifiedExpression": "",
                "hasVariable": false,
                "expressionTree": {},
                "variables": [],
                "error": {
                    "index": 4,
                    "description": "Expected expression after +"
                }
            }
        }
    },
    expressionWithVariablePrefixAt: {
        options: {
            replaceVariablePrefix: true,
            variablePrefix: '@',
            variablePrefixReplacement: 'PREFIX_AT_'
        },
        input: 'a + 2 + 5 * @someQuantity',
        output: {
            convertedASTTokens: {
                "validExpression": true,
                "expression": "a + 2 + 5 * @someQuantity",
                "modifiedExpression": "a + 2 + 5 * PREFIX_AT_someQuantity",
                "hasVariable": true,
                "expressionTree": {
                    "type": "BinaryExpression",
                    "operator": "+",
                    "left": {
                        "type": "BinaryExpression",
                        "operator": "+",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 2,
                            "raw": "2"
                        }
                    },
                    "right": {
                        "type": "BinaryExpression",
                        "operator": "*",
                        "left": {
                            "type": "Literal",
                            "value": 5,
                            "raw": "5"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "PREFIX_AT_someQuantity"
                        }
                    }
                },
                "variables": [
                    "a",
                    "@someQuantity"
                ],
                "error": {}
            }
        }
    },
    expressionWithoutVariable: {
        input: '1 + 2',
        output: {
            convertedASTTokens: {
                "validExpression": true,
                "expression": "1 + 2",
                "modifiedExpression": "",
                "expressionTree": {
                    "type": "BinaryExpression",
                    "operator": "+",
                    "left": {
                        "type": "Literal",
                        "value": 1,
                        "raw": "1"
                    },
                    "right": {
                        "type": "Literal",
                        "value": 2,
                        "raw": "2"
                    }
                },
                "hasVariable": false,
                "variables": [],
                "error": {}
            }
        }
    }
};

describe('convertToExpressionTree', function () {

    it('Converting Valid Expression', function () {
        var result = ExpressionRuleEngine.convertExpressionToExpressionTree(testData.validExpression.input);

        expect(result.validExpression).to.equal(true);
        expect(result.error).to.be.eqls({});
        expect(result).to.be.eqls(testData.validExpression.output.convertedASTTokens);
    });

    it('Converting Invalid Expression', function () {
        var result = ExpressionRuleEngine.convertExpressionToExpressionTree(testData.invalidExpression.input);

        expect(result.validExpression).to.equal(false);
        expect(result).to.be.eqls(testData.invalidExpression.output.convertedASTTokens);
    });

    it('Converting Expression with Variable Prefix "@"', function () {
        ExpressionRuleEngine.setOptions(testData.expressionWithVariablePrefixAt.options);
        var result = ExpressionRuleEngine.convertExpressionToExpressionTree(testData.expressionWithVariablePrefixAt.input);

        expect(result.validExpression).to.equal(true);
        expect(result).to.be.eqls(testData.expressionWithVariablePrefixAt.output.convertedASTTokens);
    });

    it('Converting Expression without Variable', function () {
        var result = ExpressionRuleEngine.convertExpressionToExpressionTree(testData.expressionWithoutVariable.input);

        expect(result.validExpression).to.equal(true);
        expect(result).to.be.eqls(testData.expressionWithoutVariable.output.convertedASTTokens);
    });

});


