var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');

var ExpressionRuleEngine = require('../../src/expression-rule-engine');

var tests = {
    validExpression: {
        options: {
            replaceVariablePrefix: false
        },
        testData: [
            {
                expression: 'a + b',
                result: {
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
        ]
    },
    invalidExpression: {
        options: {
            replaceVariablePrefix: false
        },
        testData: [
            {
                expression: 'a + ',
                result: {
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
        ]
    },
    expressionWithVariablePrefixAt: {
        options: {
            replaceVariablePrefix: true,
            variablePrefix: '@',
            variablePrefixReplacement: 'PREFIX_AT_'
        },
        testData: [
            {
                expression: 'a + 2 + 5 * @someQuantity',
                result: {
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
        ]
    },
    expressionWithoutVariable: {
        options: {
            replaceVariablePrefix: false
        },
        testData: [
            {
                expression: '1 + 2',
                result: {
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
        ]
    },
    expressionWithNestedVariablePrefixAt: {
        options: {
            replaceVariablePrefix: true,
            variablePrefix: '@',
            variablePrefixReplacement: ''
        },
        testData: [
            {
                expression: '(@Form1_@SomeValue >= 200) || (@Form2_@OtherValue < 500)',
                result: {
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
        ]
    }
};

describe('convertToExpressionTree', function () {

    _.forEach(tests.validExpression.testData, function (data) {
        it('Converting Valid Expression -> ' + data.expression, function () {
            ExpressionRuleEngine.setOptions(tests.validExpression.options);

            var result = ExpressionRuleEngine.convertToExpressionTree(data.expression);
            expect(result.error).to.be.eqls({});
            expect(result).to.be.eqls(data.result);
        });
    });

    _.forEach(tests.invalidExpression.testData, function (data) {
        it('Converting Invalid Expression -> ' + data.expression, function () {
            ExpressionRuleEngine.setOptions(tests.invalidExpression.options);

            var result = ExpressionRuleEngine.convertToExpressionTree(data.expression);
            expect(result.validExpression).to.equal(false);
            expect(result).to.be.eqls(data.result);
        });
    });

    _.forEach(tests.expressionWithVariablePrefixAt.testData, function (data) {
        it('Converting Expression with Variable Prefix "@" -> ' + data.expression, function () {
            ExpressionRuleEngine.setOptions(tests.expressionWithVariablePrefixAt.options);

            var result = ExpressionRuleEngine.convertToExpressionTree(data.expression);
            expect(result.validExpression).to.equal(true);
            expect(result).to.be.eqls(data.result);
        });
    });

    _.forEach(tests.expressionWithoutVariable.testData, function (data) {
        it('Converting Expression without Variable -> ' + data.expression, function () {
            ExpressionRuleEngine.setOptions(tests.expressionWithoutVariable.options);

            var result = ExpressionRuleEngine.convertToExpressionTree(data.expression);
            expect(result.validExpression).to.equal(true);
            expect(result).to.be.eqls(data.result);
        });
    });

    _.forEach(tests.expressionWithNestedVariablePrefixAt.testData, function (data) {
        it('Converting Expression with Nested Variable (Separated by _) and Prefix "@" -> ' + data.expression, function () {
            ExpressionRuleEngine.setOptions(tests.expressionWithNestedVariablePrefixAt.options);

            var result = ExpressionRuleEngine.convertToExpressionTree(data.expression);
            expect(result.validExpression).to.equal(true);
            expect(result).to.be.eqls(data.result);
        });
    });

});


