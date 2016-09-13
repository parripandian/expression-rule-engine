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
                result: true
            },
            {
                expression: 'a + b * 100',
                result: true
            }
        ]
    },
    invalidExpression: {
        options: {
            replaceVariablePrefix: false
        },
        testData: [
            {
                expression: 'a + b * ',
                result: false
            },
            {
                expression: 'a + b * 100 || ',
                result: false
            }
        ]
    },
    validExpressionWithVariablePrefixAt: {
        options: {
            replaceVariablePrefix: true,
            variablePrefix: '@',
            variablePrefixReplacement: 'PREFIX_AT_'
        },
        testData: [
            {
                expression: '(@a + @b + @c) * 55',
                result: true
            },
            {
                expression: 'a + @b * 100 ',
                result: true
            }
        ]
    },
    invalidExpressionWithVariablePrefixAt: {
        options: {
            replaceVariablePrefix: true,
            variablePrefix: '@',
            variablePrefixReplacement: 'PREFIX_AT_'
        },
        testData: [
            {
                expression: '(@SomeValue >= 200) || (@OtherValue < 500) || || )',
                result: false
            },
            {
                expression: '(@SomeValue >= 700) && (@OtherValue == 100))',
                result: false
            }
        ]
    },
    expressionWithoutVariable: {
        options: {
            replaceVariablePrefix: false
        },
        testData: [
            {
                expression: '120 + 25 ',
                result: true
            },
            {
                expression: '400 / 200 * 100',
                result: true
            },
            {
                expression: '(50 * 25) + 500',
                result: true
            }
        ]
    },
    expressionWithNestedVariable: {
        options: {
            replaceVariablePrefix: true,
            variablePrefix: '@',
            variablePrefixReplacement: 'PREFIX_AT_'
        },
        testData: [
            {
                expression: '(@Form1_@SomeValue >= 200) || (@Form2_@OtherValue < 500)',
                result: true
            },
            {
                expression: '(@Form3_@SomeValue * 200) - (@Form4_@OtherValue + 500)',
                result: true
            }
        ]
    }
};

describe('isValidExpression', function () {

    _.forEach(tests.validExpression.testData, function (data) {
        it('Checking Valid Expression -> ' + data.expression, function () {
            ExpressionRuleEngine.setOptions(tests.validExpression.options);

            var result = ExpressionRuleEngine.isValidExpression(data.expression);
            expect(result).to.equal(data.result);
        });
    });

    _.forEach(tests.invalidExpression.testData, function (data) {
        it('Checking Invalid Expression -> ' + data.expression, function () {
            ExpressionRuleEngine.setOptions(tests.invalidExpression.options);

            var result = ExpressionRuleEngine.isValidExpression(data.expression);
            expect(result).to.equal(data.result);
        });
    });

    _.forEach(tests.validExpressionWithVariablePrefixAt.testData, function (data) {
        it('Checking Valid Expression with Variable Prefix "@" -> ' + data.expression, function () {
            ExpressionRuleEngine.setOptions(tests.validExpressionWithVariablePrefixAt.options);

            var result = ExpressionRuleEngine.isValidExpression(data.expression);
            expect(result).to.equal(data.result);
        });
    });

    _.forEach(tests.invalidExpressionWithVariablePrefixAt.testData, function (data) {
        it('Checking Invalid Expression with Variable Prefix "@" -> ' + data.expression, function () {
            ExpressionRuleEngine.setOptions(tests.invalidExpressionWithVariablePrefixAt.options);

            var result = ExpressionRuleEngine.isValidExpression(data.expression);
            expect(result).to.equal(data.result);
        });
    });

    _.forEach(tests.expressionWithoutVariable.testData, function (data) {
        it('Checking Expression without Variable -> ' + data.expression, function () {
            ExpressionRuleEngine.setOptions(tests.expressionWithoutVariable.options);

            var result = ExpressionRuleEngine.isValidExpression(data.expression);
            expect(result).to.equal(data.result);
        });
    });

    _.forEach(tests.expressionWithNestedVariable.testData, function (data) {
        it('Checking Expression With Nested Variables (Separated by _) -> ' + data.expression, function () {
            ExpressionRuleEngine.setOptions(tests.expressionWithNestedVariable.options);

            var result = ExpressionRuleEngine.isValidExpression(data.expression);
            expect(result).to.equal(data.result);
        });
    });

});


