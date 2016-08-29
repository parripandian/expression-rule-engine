var chai = require('chai');
var expect = chai.expect;

var ExpressionRuleEngine = require('../../src/expression-rule-engine');

var testData = {
    validOptions: {
        replaceVariablePrefix: false,
        variablePrefix: '@',
        variablePrefixReplacement: '_'
    },
    invalidOptions: {
        somethingElse: true
    }
};

describe('setOptions', function () {

    it('Setting up Valid Options', function () {
        ExpressionRuleEngine.setOptions(testData.validOptions);
        var result = ExpressionRuleEngine.getOptions();
        expect(result.replaceVariablePrefix).to.equal(testData.validOptions.replaceVariablePrefix);
        expect(result.variablePrefix).to.equal(testData.validOptions.variablePrefix);
        expect(result.variablePrefixReplacement).to.equal(testData.validOptions.variablePrefixReplacement);
        expect(result).to.have.ownProperty('replaceVariablePrefix');
        expect(result).to.have.ownProperty('variablePrefix');
        expect(result).to.have.ownProperty('variablePrefixReplacement');
    });

    it('Setting up Invalid Options', function () {
        ExpressionRuleEngine.setOptions(testData.invalidOptions);
        var result = ExpressionRuleEngine.getOptions();
        expect(result).not.to.have.ownProperty('somethingElse');
    });

});


