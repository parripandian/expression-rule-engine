var chai = require('chai');
var expect = chai.expect;

var ExpressionRuleEngine = require('../../src/expression-rule-engine');

var testData = {
    validExpression: {
        input: 'a + b',
        output: {}
    },
    invalidExpression: {
        input: 'a + '
    },
    validExpressionWithVariablePrefixAt: {
        options: {
            replaceVariablePrefix: true,
            variablePrefix: '@',
            variablePrefixReplacement: 'PREFIX_AT_'
        },
        input: '(@a + @b + @c) * 100'
    },
    invalidExpressionWithVariablePrefixAt: {
        options: {
            replaceVariablePrefix: true,
            variablePrefix: '@',
            variablePrefixReplacement: 'PREFIX_AT_'
        },
        input: '(@SomeValue >= 200) || (@OtherValue < 500) || || )'
    },
    expressionWithoutVariable: {
        input: '1 + 2',
        output: {}
    }
};

describe('isValidExpression', function () {

    it('Checking Valid Expression', function () {
        var result = ExpressionRuleEngine.isValidExpression(testData.validExpression.input);
        expect(result).to.equal(true);
    });

    it('Checking Invalid Expression', function () {
        var result = ExpressionRuleEngine.isValidExpression(testData.invalidExpression.input);
        expect(result).to.equal(false);
    });

    it('Checking Valid Expression with Variable Prefix "@"', function () {
        ExpressionRuleEngine.setOptions(testData.validExpressionWithVariablePrefixAt.options);
        var result = ExpressionRuleEngine.isValidExpression(testData.validExpressionWithVariablePrefixAt.input);
        expect(result).to.equal(true);
    });

    it('Checking Invalid Expression with Variable Prefix "@"', function () {
        ExpressionRuleEngine.setOptions(testData.invalidExpressionWithVariablePrefixAt.options);
        var result = ExpressionRuleEngine.isValidExpression(testData.invalidExpressionWithVariablePrefixAt.input);
        expect(result).to.equal(false);
    });

    it('Checking Expression without Variable', function () {
        var result = ExpressionRuleEngine.isValidExpression(testData.expressionWithoutVariable.input);
        expect(result).to.equal(true);
    });
});


