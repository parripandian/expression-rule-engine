var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');

var ExpressionRuleEngine = require('../../src/expression-rule-engine');

var tests = {
    expressionWithoutPrefix: {
        options: {
            replaceVariablePrefix: false,
            variablePrefix: '',
            variablePrefixReplacement: ''
        },
        testData: [
            {
                expression: '(a + b) * 5',
                variableValues: {
                    "a": 10,
                    "b": 10
                },
                evaluatedValue: 100
            },
            {
                expression: 'a + b / 20',
                variableValues: {
                    "a": 10,
                    "b": 10
                },
                evaluatedValue: 10.5
            },
            {
                expression: 'isEditable || isAuthor && isAdmin',
                variableValues: {
                    "isEditable": false,
                    "isAuthor": true
                },
                evaluatedValue: ''
            },
            {
                expression: 'Math.sqrt(a * a)',
                variableValues: {
                    "a": 10,
                    "b": 10
                },
                evaluatedValue: 10
            }
        ]
    },
    expressionWithPrefixAt: {
        options: {
            replaceVariablePrefix: true,
            variablePrefix: '@',
            variablePrefixReplacement: 'PREFIX_AT_'
        },
        testData: [
            {
                expression: '(@a + b) * 5',
                variableValues: {
                    "a": 10,
                    "b": 10
                },
                evaluatedValue: 100
            },
            {
                expression: '@a + @b / 20',
                variableValues: {
                    "a": 10,
                    "b": 10
                },
                evaluatedValue: 10.5
            },
            {
                expression: '@isEditable || @isAuthor && @isAdmin',
                variableValues: {
                    "isEditable": false,
                    "isAuthor": true,
                    "isAdmin": true
                },
                evaluatedValue: true
            }
        ]
    },
    expressionWithNestedVariableAndPrefixAt: {
        options: {
            replaceVariablePrefix: true,
            variablePrefix: '@',
            variablePrefixReplacement: 'PREFIX_AT_'
        },
        testData: [
            {
                expression: '(@Form1_@SomeValue * 100) + (@Form2_@OtherValue / 10)',
                variableValues: {
                    "Form1_SomeValue": 10,
                    "Form2_OtherValue": 10
                },
                evaluatedValue: 1001
            }
        ]
    }
};

describe('evaluateExpression', function () {
    _.forEach(tests.expressionWithoutPrefix.testData, function (input) {
        it('Evaluating Expression (Without Prefix) -> ' + input.expression, function () {
            ExpressionRuleEngine.setOptions(tests.expressionWithoutPrefix.options);

            var result = ExpressionRuleEngine.evaluateExpression(input.expression, input.variableValues);
            expect(result.evaluatedValue).to.equal(input.evaluatedValue);
        });
    });

    _.forEach(tests.expressionWithPrefixAt.testData, function (input) {
        it('Evaluating Expression (With Prefix) -> ' + input.expression, function () {
            ExpressionRuleEngine.setOptions(tests.expressionWithPrefixAt.options);

            var result = ExpressionRuleEngine.evaluateExpression(input.expression, input.variableValues);
            expect(result.evaluatedValue).to.equal(input.evaluatedValue);
        });
    });

    _.forEach(tests.expressionWithNestedVariableAndPrefixAt.testData, function (input) {
        it('Evaluating Expression (With Prefix) and Nested Variable (Separated by _) -> ' + input.expression, function () {
            ExpressionRuleEngine.setOptions(tests.expressionWithNestedVariableAndPrefixAt.options);

            var result = ExpressionRuleEngine.evaluateExpression(input.expression, input.variableValues);
            expect(result.evaluatedValue).to.equal(input.evaluatedValue);
        });
    });
});


