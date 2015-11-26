/*! angular-query-builder - v1.0.0 - 2015-11-26 */
/*! https://github.com/niklr/angular-query-builder */
angular.module('angular-query-builder', [
    'ngAnimate',
    'templates-aqb',
    'aqb.src.directives',
    'aqb.src.helpers'
])

.factory('AppConfig', function () {

    var maxConditions;
    var maxGroups;

    return {
        setMaxConditions: function (max) {
            maxConditions = max;
        },
        getMaxConditions: function () {
            return maxConditions;
        },
        setMaxGroups: function (max) {
            maxGroups = max;
        },
        getMaxGroups: function () {
            return maxGroups;
        }
    };
});
angular.module('aqb.src.directives', [
    'aqb.src.directives.search-group',
    'aqb.src.directives.search-condition'
]);
angular.module('aqb.src.directives.search-condition', [])

.directive('searchCondition', ['$http', '$timeout', 'GuidHelper', function ($http, $timeout, GuidHelper) {
    return {
        scope: {
            condition: "=",
            conditionIndex: "=",
            sourceType: "="
        },
        templateUrl: 'directives/search-condition.tpl.html',
        controller: ['$scope', '$element', '$attrs', '$transclude', function ($scope, $element, $attrs, $transclude) {

            var searchConditionInputItemId = GuidHelper.create();
            $scope.searchConditionInputItemId = searchConditionInputItemId;

            function addTypeahead(sourceUrl) {

                var entityMap = {};

                function sourceFn(query, typeahead) {
                    var newData = [];
                    return $http.get(sourceUrl + query).then(function (success) {
                        entityMap = {};
                        $.each(success.data, function () {
                            var label = this.displayName;
                            this.isTypeahead = true;
                            entityMap[label] = this;
                            newData.push(label);
                        });
                        return typeahead(newData);
                    }, function (error) {
                        return newData;
                    });
                }

                var $searchConditionInputItem = $('#' + searchConditionInputItemId);
                var typeahead = $searchConditionInputItem.data('typeahead');

                if (!typeahead) {
                    $searchConditionInputItem.typeahead({
                        minLength: 0,
                        source: sourceFn,
                        updater: function (item) {
                            $scope.inputItem = angular.copy(entityMap[item]);
                            return item;
                        }
                    });
                }
                else {
                    typeahead.source = sourceFn;
                }
            }

            function removeTypeahead() {
                var typeahead = $('#' + searchConditionInputItemId).data('typeahead');
                if (!!typeahead) {
                    typeahead.source = [];
                }
            }

            // Source fields start

            function setSelectedSourceField() {
                if (!!$scope.condition.sourceField && !!$scope.sourceType) {
                    $scope.selectedSourceField = _.find($scope.sourceType.sourceFields, function (field) {
                        return field.name === $scope.condition.sourceField.name;
                    });
                }
            }
            setSelectedSourceField();

            $scope.$watch("selectedSourceField", function () {
                if (!!$scope.selectedSourceField) {
                    $scope.condition.sourceField = {
                        "name": $scope.selectedSourceField.name,
                        "displayName": $scope.selectedSourceField.displayName
                    };
                }
            });

            // Source fields end

            // Comparison operators start

            function setSelectedComparisonOperator() {
                if (!!$scope.selectedSourceField) {
                    $scope.selectedComparisonOperator = _.find($scope.selectedSourceField.comparisonOperators, function (operator) {
                        return operator.name === $scope.condition.comparisonOperator.name;
                    });
                }
            }
            setSelectedComparisonOperator();

            $scope.$watch("selectedComparisonOperator", function (newValue, oldValue) {
                if (!!$scope.selectedComparisonOperator) {
                    if (newValue !== oldValue) {
                        $scope.inputItem = undefined;
                    }

                    $scope.condition.comparisonOperator = {
                        "name": $scope.selectedComparisonOperator.name,
                        "displayName": $scope.selectedComparisonOperator.displayName
                    };
                    if (!!$scope.selectedComparisonOperator.typeaheadUrl) {
                        // Wait until DOM has finished rendering
                        $timeout(function () {
                            addTypeahead($scope.selectedComparisonOperator.typeaheadUrl);
                        }, 0);                        
                    }
                    else {
                        removeTypeahead();
                    }
                }
            });

            // Comparison operators end

            // Input items start

            $scope.inputItem = $scope.condition.inputItem;

            $scope.$watch("inputItem.displayName", function () {
                if (!!$scope.inputItem) {
                    if (!$scope.inputItem.isTypeahead) {
                        // Set data to displayName if it is not a typeahead
                        $scope.inputItem.data = $scope.inputItem.displayName;
                    }
                    $scope.condition.inputItem = $scope.inputItem;
                }
            });

            // Input items end

            $scope.canAddCondition = $scope.$parent.canAddCondition;
            $scope.addCondition = $scope.$parent.addCondition;
            $scope.removeCondition = $scope.$parent.removeCondition;
        }],
    };
}]);
angular.module('aqb.src.directives.search-group', ['aqb.src.helpers.recursion'])

.directive('searchGroup', ['$timeout', 'AppConfig', 'RecursionHelper', function ($timeout, AppConfig, RecursionHelper) {
    return {
        scope: {
            searchContainer: "=",
            groups: "=",
            groupIndex: "=",
            sourceTypes: "=",
            logicalOperators: "="        
        },
        templateUrl: 'directives/search-group.tpl.html',
        controller: ['$scope', '$element', '$attrs', '$transclude', function ($scope, $element, $attrs, $transclude) {

            $scope.group = $scope.groups[$scope.groupIndex];

            // Source types start

            function setSelectedSourceType() {
                if (!!$scope.group.sourceType) {
                    $scope.selectedSourceType = _.find($scope.sourceTypes, function (sourceType) {
                        return sourceType.name === $scope.group.sourceType.name;
                    });
                }
            }
            setSelectedSourceType();

            $scope.selectSourceType = function (sourceType) {
                $scope.group.sourceType = {
                    "name": sourceType.name,
                    "displayName": sourceType.displayName
                };
                setSelectedSourceType();
            };

            // Source types end

            // Logical operators start

            function setSelectedLogicalOperator() {
                if (!!$scope.group.logicalOperator) {
                    $scope.selectedLogicalOperator = _.find($scope.logicalOperators, function (logicalOperator) {
                        return logicalOperator.name === $scope.group.logicalOperator.name;
                    });
                }
            }
            setSelectedLogicalOperator();

            $scope.selectLogicalOperator = function (logicalOperator) {
                $scope.group.logicalOperator = {
                    "name": logicalOperator.name,
                    "displayName": logicalOperator.displayName
                };
                setSelectedLogicalOperator();
            };

            // Logical operators end

            // Group functions start

            function recursiveGroupCount(item, count) {
                if (!!item && !!item.groups && item.groups instanceof Array) {
                    count = count + item.groups.length;
                    for (var i = 0; i < item.groups.length; i++) {
                        count = recursiveGroupCount(item.groups[i], count);
                    }
                }
                return count;
            }

            var maxGroups = AppConfig.getMaxGroups();

            $scope.canAddGroup = function () {
                var canAddGroup = false;
                if (!maxGroups || maxGroups <= 0) {
                    canAddGroup = true;
                }
                else {
                    var groupCount = 0;
                    groupCount = recursiveGroupCount($scope.searchContainer, groupCount);
                    canAddGroup = groupCount + 1 <= maxGroups;
                }
                return canAddGroup;
            };

            $scope.canRemoveGroup = function () {
                var groupCount = 0;
                groupCount = recursiveGroupCount($scope.searchContainer, groupCount);
                return groupCount > 1 && $scope.group !== $scope.searchContainer.groups[0];
            };

            $scope.addGroup = function () {
                var sourceType = $scope.sourceTypes[0];
                var logicalOperator = $scope.logicalOperators[0];
                var newGroup = {
                    "sourceType": {
                        "name": sourceType.name,
                        "displayName": sourceType.displayName
                    },
                    "logicalOperator": {
                        "name": logicalOperator.name,
                        "displayName": logicalOperator.displayName
                    },
                    "conditions": [
                        {}
                    ]
                };
                if ($scope.group.groups === undefined) {
                    $scope.group.groups = [];
                }
                $scope.group.groups.push(newGroup);
            };

            $scope.removeGroup = function () {
                if ($scope.group !== $scope.searchContainer.groups[0]) {
                    var index = $scope.groups.indexOf($scope.group);
                    if (index > -1) {
                        $scope.groups.splice(index, 1);
                    }
                }
            };

            // Group functions end

            // Condition functions start

            var maxConditions = AppConfig.getMaxConditions();

            $scope.canAddCondition = function (index) {
                var canAddCondition = false;
                var conditionsCount = 1;
                if (!!$scope.group.conditions && $scope.group.conditions instanceof Array) {
                    conditionsCount = $scope.group.conditions.length;
                }

                if ((!maxConditions || maxConditions <= 0) && index + 1 === conditionsCount) {
                    canAddCondition = true;
                }
                else {
                    canAddCondition = conditionsCount + 1 <= maxConditions && index + 1 === conditionsCount;
                }
                return canAddCondition;
            };

            $scope.addCondition = function (form) {
                var isValid = false;
                if (!!form) {
                    if (form.$valid) {
                        isValid = true;
                    }
                }
                else {
                    isValid = true;
                }

                if (isValid) {
                    var newCondition = {};
                    $scope.group.conditions.push(newCondition);
                }
            };

            $scope.removeCondition = function (index) {
                $scope.group.conditions.splice(index, 1);
            };

            // Condition functions end
        }],
        compile: function (element) {
            // Use the compile function from the RecursionHelper
            // and return the linking function(s) which it returns.
            return RecursionHelper.compile(element);
        }
    };
}]);
angular.module('aqb.src.helpers.guid', [])

.factory('GuidHelper', function () {
    /**
     * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    */
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return {
        create: function () {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    };
});
angular.module('aqb.src.helpers', [
    'aqb.src.helpers.guid',
    'aqb.src.helpers.recursion'
]);
angular.module('aqb.src.helpers.recursion', [])

.factory('RecursionHelper', ['$compile', function ($compile) {
    return {
        /**
         * Manually compiles the element, fixing the recursion loop.
         * http://stackoverflow.com/questions/14430655/recursion-in-angular-directives
         * @param element
         * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function (element, link) {
            // Normalize the link parameter
            if (angular.isFunction(link)) {
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function (scope, element) {
                    // Compile the contents
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function (clone) {
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if (link && link.post) {
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
}]);