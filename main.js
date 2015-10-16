angular.module('app', [
    'angular-query-builder'
])

.constant('APP_VERSION', angular_query_builder_version)

.config(['$httpProvider', '$logProvider', function ($httpProvider, $logProvider) {

    $logProvider.debugEnabled(true);

    var interceptor = ['$rootScope', '$q', '$location', function ($rootScope, $q, $location) {

        // Some object types returned by the typeahead
        var objectTypes = [
            {
                "data": "Subject",
                "displayName": "Subject"
            },
            {
                "data": "Study",
                "displayName": "Study"
            },
            {
                "data": "RawImage",
                "displayName": "Raw Image"
            },
            {
                "data": "SegmentationImage",
                "displayName": "Segmentation Image"
            },
            {
                "data": "ClinicalStudyData",
                "displayName": "Clinical Study Data"
            },
            {
                "data": "ClinicalStudyDefinition",
                "displayName": "Clinical Study Definition"
            },
            {
                "data": "StatisticalModel",
                "displayName": "Statistical Model"
            },
            {
                "data": "GenomicData",
                "displayName": "Genomic Data"
            },
            {
                "data": "GenomicSeries",
                "displayName": "Genomic Series"
            },
            {
                "data": "GenomicPlatform",
                "displayName": "Genomic Platform"
            }
        ];

        // Some FMA terms returned by the typeahead
        var fmaTerms = [
            {
                "data": "3734",
                "displayName": "Aorta"
            },
            {
                "data": "3740",
                "displayName": "Bulb of aorta"
            },
            {
                "data": "7195",
                "displayName": "Lung"
            },
            {
                "data": "7203",
                "displayName": "Kidney"
            },
            {
                "data": "50801",
                "displayName": "Brain"
            }
        ];

        return {
            'request': function (request) {
                if (request.url.indexOf("https://localhost/aqb/typeahead/object-types/") > -1 ||
                        request.url.indexOf("https://localhost/aqb/typeahead/fma/") > -1) {
                    request.timeout = 1;
                }
                return request;
            },
            'responseError': function (response) {
                if (response.config.url.indexOf("https://localhost/aqb/typeahead/object-types/") > -1) {
                    response.data = objectTypes;
                    response.status = 200;
                }
                else if (response.config.url.indexOf("https://localhost/aqb/typeahead/fma/") > -1) {
                    response.data = fmaTerms;
                    response.status = 200;
                }
                return response;
            }
        };
    }];
    $httpProvider.interceptors.push(interceptor);
}])

.controller('MainController', ['$scope', '$sce', '$log', 'APP_VERSION', 'AppConfig', function ($scope, $sce, $log, APP_VERSION, AppConfig) {

    $scope.appVersion = APP_VERSION;

    AppConfig.setMaxGroups(4);
    AppConfig.setMaxConditions(4);

    $scope.jsonOutput = {};

    $scope.search = function (form, $event) {
        $log.debug($scope.searchContainer);
        $scope.jsonOutput = JSON.stringify($scope.searchContainer, null, 4);
    };

    $scope.$watch("searchContainer", function () {
        $scope.jsonOutput = {};
        var groups = $scope.searchContainer.groups;
        if (!!groups && groups instanceof Array && groups.length > 0) {
            $scope.output = $sce.trustAsHtml(computeOutput(groups[0]));
        }
    }, true);

    function computeOutput(group) {
        if (!group) return "";
        for (var str = "(", i = 0; i < group.conditions.length; i++) {
            i > 0 && (str += " <strong>" + group.logicalOperator.displayName + "</strong> ");
            var condition = group.conditions[i];
            if (!!condition && !!condition.sourceField && !!condition.comparisonOperator && !!condition.inputItem) {
                str += condition.sourceField.displayName + " " + condition.comparisonOperator.displayName + " '" + condition.inputItem.displayName + "'";
            }
        }

        if (!!group.groups && group.groups instanceof Array) {
            for (var x = 0; x < group.groups.length; x++) {
                str += " <strong>" + group.logicalOperator.displayName + "</strong> ";
                str += computeOutput(group.groups[x]);
            }
        }

        return str + ")";
    }

    var sourceFields = [
    {
        "name": "Type",
        "displayName": "Type",
        "position": 1,
        "comparisonOperators": [
            {
                "name": "Equals",
                "displayName": "=",
                "position": 1,
                "typeaheadUrl": "https://localhost/aqb/typeahead/object-types/"
            },
            {
                "name": "NotEquals",
                "displayName": "!=",
                "position": 2,
                "typeaheadUrl": "https://localhost/aqb/typeahead/object-types/"
            }
        ]
    },
    {
        "name": "ObjectId",
        "displayName": "Id",
        "position": 2,
        "comparisonOperators": [
            {
                "name": "Equals",
                "displayName": "=",
                "position": 1
            },
            {
                "name": "NotEquals",
                "displayName": "!=",
                "position": 2
            },
            {
                "name": "Greater",
                "displayName": ">",
                "position": 6
            },
            {
                "name": "Less",
                "displayName": "<",
                "position": 7
            },
            {
                "name": "GreaterEqual",
                "displayName": ">=",
                "position": 8
            },
            {
                "name": "LessEqual",
                "displayName": "<=",
                "position": 9
            }
        ]
    },
    {
        "name": "SubjectId",
        "displayName": "Subject Id",
        "position": 3,
        "comparisonOperators": [
            {
                "name": "Equals",
                "displayName": "=",
                "position": 1
            },
            {
                "name": "NotEquals",
                "displayName": "!=",
                "position": 2
            },
            {
                "name": "Contains",
                "displayName": "Contains",
                "position": 3
            }
        ]
    },
    {
        "name": "AnatomicalRegion",
        "displayName": "Anatomical Region",
        "position": 4,
        "comparisonOperators": [
            {
                "name": "Contains",
                "displayName": "Contains",
                "position": 1,
                "typeaheadUrl": "https://localhost/aqb/typeahead/fma/"
            },
            {
                "name": "Equals",
                "displayName": "=",
                "position": 2,
                "typeaheadUrl": "https://localhost/aqb/typeahead/fma/"
            },
            {
                "name": "NotEquals",
                "displayName": "!=",
                "position": 3,
                "typeaheadUrl": "https://localhost/aqb/typeahead/fma/"
            }
        ]
    },
    {
        "name": "Fulltext",
        "displayName": "Fulltext",
        "position": 5,
        "comparisonOperators": [
            {
                "name": "Equals",
                "displayName": "=",
                "position": 1
            }
        ]
    },
    {
        "name": "FileExtension",
        "displayName": "File Extension",
        "position": 6,
        "comparisonOperators": [
            {
                "name": "Equals",
                "displayName": "=",
                "position": 1
            },
            {
                "name": "NotEquals",
                "displayName": "!=",
                "position": 2
            }
        ]
    },
    {
        "name": "Placeholder",
        "displayName": "Placeholder",
        "position": 7,
        "comparisonOperators": [
            {
                "name": "Equals",
                "displayName": "=",
                "position": 1,
                "typeaheadUrl": "https://localhost/aqb/typeahead/object-types/"
            },
            {
                "name": "Contains",
                "displayName": "Contains",
                "position": 3
            },
            {
                "name": "NotEquals",
                "displayName": "!=",
                "position": 2,
                "typeaheadUrl": "https://localhost/aqb/typeahead/fma/"
            }
        ]
    }
    ];

    var sourceTypes = [
        {
            "name": "Objects",
            "displayName": "Objects",
            "position": 1,
            "sourceFields": sourceFields
        },
        {
            "name": "RelatedObjects",
            "displayName": "Related Objects",
            "position": 2,
            "sourceFields": sourceFields
        }
    ];
    $scope.sourceTypes = sourceTypes;

    var logicalOperators = [
    {
        "name": "And",
        "displayName": "AND",
        "position": 1
    },
    {
        "name": "Or",
        "displayName": "OR",
        "position": 2
    }
    ];
    $scope.logicalOperators = logicalOperators;

    var searchContainer = {
        "groups": [
            {
                "logicalOperator": {
                    "name": "And",
                    "displayName": "AND"
                },
                "sourceType": {
                    "name": "Objects",
                    "displayName": "Objects"
                },
                "conditions": [
                     {
                         "sourceField": {
                             "name": "Type",
                             "displayName": "Type"
                         },
                         "comparisonOperator": {
                             "name": "Equals",
                             "displayName": "="
                         },
                         "inputItem": {
                             "data": "Subject",
                             "displayName": "Subject",
                             "isTypeahead": true
                         }
                     }
                ],
                "groups": [
                    {
                        "logicalOperator": {
                            "name": "And",
                            "displayName": "AND"
                        },
                        "sourceType": {
                            "name": "RelatedObjects",
                            "displayName": "Related Objects"
                        },
                        "conditions": [
                             {
                                 "sourceField": {
                                     "name": "AnatomicalRegion",
                                     "displayName": "Anatomical Region"
                                 },
                                 "comparisonOperator": {
                                     "name": "Equals",
                                     "displayName": "="
                                 },
                                 "inputItem": {
                                     "data": "7203",
                                     "displayName": "Kidney",
                                     "isTypeahead": true
                                 }
                             },
                             {
                                 "sourceField": {
                                     "name": "Type",
                                     "displayName": "Type"
                                 },
                                 "comparisonOperator": {
                                     "name": "Equals",
                                     "displayName": "="
                                 },
                                 "inputItem": {
                                     "data": "RawImage",
                                     "displayName": "Raw Image",
                                     "isTypeahead": true
                                 }
                             },
                             {
                                 "sourceField": {
                                     "name": "Type",
                                     "displayName": "Type"
                                 },
                                 "comparisonOperator": {
                                     "name": "Equals",
                                     "displayName": "="
                                 },
                                 "inputItem": {
                                     "data": "ClinicalStudyData",
                                     "displayName": "Clinical Study Data",
                                     "isTypeahead": true
                                 }
                             },
                             {
                                 "sourceField": {
                                     "name": "Type",
                                     "displayName": "Type"
                                 },
                                 "comparisonOperator": {
                                     "name": "Equals",
                                     "displayName": "="
                                 },
                                 "inputItem": {
                                     "data": "GenomicData",
                                     "displayName": "Genomic Data",
                                     "isTypeahead": true
                                 }
                             }
                        ]
                    }
                ]
            }
        ]
    };
    var emptySearchContainer = {
        "groups": [
            {
                "conditions": [
                    {}
                ]
            }
        ]
    };
    $scope.searchContainer = searchContainer;
}]);