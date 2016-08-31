var chai = require('chai');
var expect = chai.expect;

var ExpressionRuleEngine = require('../../src/expression-rule-engine');

var testData = {
    validExpression: {
        input: 'a + b',
        output: {
            expressionTree: {
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
            expressionTree: {
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
            expressionTree: {
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
            expressionTree: {
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
    },
    expressionWithNestedVariablePrefixAt: {
        options: {
            replaceVariablePrefix: true,
            variablePrefix: '@',
            variablePrefixReplacement: ''
        },
        input: '(@Form1_@SomeValue >= 200) || (@Form2_@OtherValue < 500)',
        output: {
            expressionTree: {
                "validExpression": true,
                "expression": "(@Form1_@SomeValue >= 200) || (@Form2_@OtherValue < 500)",
                "modifiedExpression": "(Form1_SomeValue >= 200) || (Form2_OtherValue < 500)",
                "expressionTree": {
                    "type": "LogicalExpression",
                    "operator": "||",
                    "left": {
                        "type": "BinaryExpression",
                        "operator": ">=",
                        "left": {
                            "type": "Identifier",
                            "name": "Form1_SomeValue"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 200,
                            "raw": "200"
                        }
                    },
                    "right": {
                        "type": "BinaryExpression",
                        "operator": "<",
                        "left": {
                            "type": "Identifier",
                            "name": "Form2_OtherValue"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 500,
                            "raw": "500"
                        }
                    }
                },
                "variables": [
                    "Form1_SomeValue",
                    "Form2_OtherValue"
                ],
                "hasVariable": true,
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
        expect(result).to.be.eqls(testData.validExpression.output.expressionTree);
    });

    it('Converting Invalid Expression', function () {
        var result = ExpressionRuleEngine.convertExpressionToExpressionTree(testData.invalidExpression.input);

        expect(result.validExpression).to.equal(false);
        expect(result).to.be.eqls(testData.invalidExpression.output.expressionTree);
    });

    it('Converting Expression with Variable Prefix "@"', function () {
        ExpressionRuleEngine.setOptions(testData.expressionWithVariablePrefixAt.options);
        var result = ExpressionRuleEngine.convertExpressionToExpressionTree(testData.expressionWithVariablePrefixAt.input);

        expect(result.validExpression).to.equal(true);
        expect(result).to.be.eqls(testData.expressionWithVariablePrefixAt.output.expressionTree);
    });

    it('Converting Expression without Variable', function () {
        var result = ExpressionRuleEngine.convertExpressionToExpressionTree(testData.expressionWithoutVariable.input);

        expect(result.validExpression).to.equal(true);
        expect(result).to.be.eqls(testData.expressionWithoutVariable.output.expressionTree);
    });

    it('Converting Expression with Nested Variable (Separated by _) and Prefix "@"', function () {
        ExpressionRuleEngine.setOptions(testData.expressionWithNestedVariablePrefixAt.options);
        var result = ExpressionRuleEngine.convertExpressionToExpressionTree(testData.expressionWithNestedVariablePrefixAt.input);

        expect(result.validExpression).to.equal(true);
        expect(result).to.be.eqls(testData.expressionWithNestedVariablePrefixAt.output.expressionTree);
    });

});


