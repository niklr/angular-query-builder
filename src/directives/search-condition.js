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