/**
 * Module: (JavaScript) Expression Rule Engine
 * Description: <%= description %>
 * Version: <%= version %>
 * Author: <%= author %>
 * License: <%= license %>
 * GitHub URL: <%= url %>
 */

(function () {
    'use strict';

    module.exports = {
        setOptions: setOptions,
        getOptions: getOptions,
        isValidExpression: isValidExpression,
        convertToExpressionTree: convertToExpressionTree,
        evaluateExpression: evaluateExpression
    };

    var JavaScriptExpressionParser = require('jsep');
    var JavaScriptExpressionBuilder = require('jseb');
    var _ = require('lodash');

    var engineRuleOptions = {
        replaceVariablePrefix: false,
        variablePrefix: '',
        variablePrefixReplacement: ''
    };

    function setOptions(options) {
        _.forEach(options, function (optionValue, option) {
            if (engineRuleOptions.hasOwnProperty(option)) {
                engineRuleOptions[option] = optionValue;
            }
        });
    }

    function getOptions() {
        return engineRuleOptions;
    }

    function isValidExpression(expression) {
        var validExpression = true;

        if (engineRuleOptions.replaceVariablePrefix) {
            expression = expression.replace(new RegExp(engineRuleOptions.variablePrefix, 'g'), engineRuleOptions.variablePrefixReplacement);
        }

        try {
            var expressionTree = JavaScriptExpressionParser(expression);
        } catch (exception) {
            validExpression = false;
        }

        return validExpression;
    }

    function convertToExpressionTree(expression) {
        var validExpression = true;
        var expressionTree = {};
        var error = {};
        var variables = [];
        var modifiedExpression = expression;

        if (engineRuleOptions.replaceVariablePrefix) {
            modifiedExpression = modifiedExpression.replace(new RegExp(engineRuleOptions.variablePrefix, 'g'), engineRuleOptions.variablePrefixReplacement);
        }

        try {
            expressionTree = JavaScriptExpressionParser(modifiedExpression);
        } catch (exception) {
            error = exception;
            validExpression = false;
        }

        if (expression === modifiedExpression) {
            modifiedExpression = '';
        }

        if (validExpression) {
            variables = extractVariables(expressionTree);
        }

        return {
            validExpression: validExpression,
            expression: expression,
            modifiedExpression: modifiedExpression,
            expressionTree: expressionTree,
            variables: variables,
            hasVariable: (variables.length > 0),
            error: error
        };
    }

    function extractVariables(expressionTree) {
        var variables = [];
        parseVariables(expressionTree, variables, false);
        return variables;
    }

    function parseVariables(tree, variables, skipOnFirstVariable) {
        if (skipOnFirstVariable && variables.length > 0) {
            return variables;
        }

        if (_.isObject(tree)) {
            _.forEach(tree, function (childTree, attribute) {
                if (attribute === 'type') {
                    if (childTree === 'Identifier') {
                        if (engineRuleOptions.replaceVariablePrefix && !_.isEmpty(engineRuleOptions.variablePrefixReplacement)) {
                            variables.push(tree.name.replace(new RegExp(engineRuleOptions.variablePrefixReplacement, 'g'), engineRuleOptions.variablePrefix));
                        } else {
                            variables.push(tree.name);
                        }
                    }
                } else {
                    if (_.isArray(childTree)) {
                        _.forEach(childTree, function (grandChildTree, index) {
                            parseVariables(grandChildTree, variables, skipOnFirstVariable);
                        });
                    } else if (_.isObject(childTree)) {
                        parseVariables(childTree, variables, skipOnFirstVariable);
                    }
                }
            });
        }
    }

    function evaluateExpression(expression, variableValues) {
        var evaluatedExpression = {};
        var convertedExpression = convertToExpressionTree(expression);

        if (convertedExpression.validExpression) {
            evaluatedExpression = evaluateExpressionTree(convertedExpression.expressionTree, variableValues);
            evaluatedExpression.expression = expression;
            evaluatedExpression.validExpression = convertedExpression.validExpression;
        } else {
            evaluatedExpression = {
                expression: expression,
                validExpression: convertedExpression.validExpression
            };
        }

        return evaluatedExpression;
    }

    function evaluateExpressionTree(expressionTree, variableValues) {
        replaceVariables(expressionTree, variableValues);
        var replacedExpression = JavaScriptExpressionBuilder(expressionTree);
        var evaluatedValue = '';
        var error = {
            occurred: false,
            message: ''
        };

        try {
            evaluatedValue = eval(replacedExpression);
        } catch (exception) {
            error = {
                occurred: true,
                message: exception.message
            };
        }

        return {
            replacedExpression: replacedExpression,
            evaluatedValue: evaluatedValue,
            error: error
        };
    }

    function replaceVariables(expressionTree, variableValues) {
        if (_.isUndefined(variableValues)) {
            console.log(variableValues);
            variableValues = {};
        }

        var value = '';
        var variableName = '';
        if (_.isObject(expressionTree)) {
            _.forEach(expressionTree, function (childExpressionTree, attribute) {
                if (attribute === 'type') {
                    if (childExpressionTree === 'Identifier') {
                        if (engineRuleOptions.replaceVariablePrefix) {
                            variableName = expressionTree.name.replace(new RegExp(engineRuleOptions.variablePrefixReplacement, 'g'), '');
                        } else {
                            variableName = expressionTree.name;
                        }

                        value = variableValues[variableName];

                        if (_.isNumber(value)) {
                            expressionTree.name = value;
                        } else if (_.isString(value)) {
                            expressionTree.name = '"' + value + '"';
                        } else if (_.isBoolean(value)) {
                            expressionTree.name = value;
                        }
                    }
                } else {
                    if (_.isArray(childExpressionTree)) {
                        _.forEach(childExpressionTree, function (grandChildExpressionTree, index) {
                            replaceVariables(grandChildExpressionTree, variableValues);
                        });
                    } else if (_.isObject(childExpressionTree)) {
                        replaceVariables(childExpressionTree, variableValues);
                    }
                }
            });
        }
    }

})();