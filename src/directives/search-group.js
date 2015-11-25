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