var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');

var ExpressionRuleEngine = require('../../src/expression-rule-engine');

var testData = {
    expressionWithoutPrefix: {
        options: {
            replaceVariablePrefix: false,
            variablePrefix: '',
            variablePrefixReplacement: ''
        },
        inputs: [
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
        inputs: [
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
        inputs: [
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
    _.forEach(testData.expressionWithoutPrefix.inputs, function (input) {
        it('Evaluating Expression (Without Prefix) ' + input.expression, function () {
            ExpressionRuleEngine.setOptions(testData.options);

            var result = ExpressionRuleEngine.evaluateExpression(input.expression, input.variableValues);
            expect(result.evaluatedValue).to.equal(input.evaluatedValue);
        });
    });

    _.forEach(testData.expressionWithPrefixAt.inputs, function (input) {
        it('Evaluating Expression (With Prefix) ' + input.expression, function () {
            ExpressionRuleEngine.setOptions(testData.options);

            var result = ExpressionRuleEngine.evaluateExpression(input.expression, input.variableValues);
            expect(result.evaluatedValue).to.equal(input.evaluatedValue);
        });
    });

    _.forEach(testData.expressionWithNestedVariableAndPrefixAt.inputs, function (input) {
        it('Evaluating Expression (With Prefix) and Nested Variable (Separated by _) ' + input.expression, function () {
            ExpressionRuleEngine.setOptions(testData.options);

            var result = ExpressionRuleEngine.evaluateExpression(input.expression, input.variableValues);
            expect(result.evaluatedValue).to.equal(input.evaluatedValue);
        });
    });
});


