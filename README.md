Angular Query Builder
=========

Demo: http://niklr.github.io/angular-query-builder

This is a sample HTML / JavaScript application that demonstrates how to use AngularJS to create a dynamic query building web UI.

The project was inspired by: https://github.com/mfauveau/angular-query-builder

Additional features:
* Autocomplete based on selected options implemented with Bootstrap's typeahead plugin.
* Dynamic source fields based on selected source types.
* Dynamic comparison operators based on selected source field.
* Nested form validation.
* Configurable maximum for groups and conditions.
* Fancy enter and leave animations for groups and conditions.

Table of Content
* [Dependencies](#dependencies)
* [Basic setup](#basic_setup)
* [Building process](#building)

## Dependencies <a name="dependencies"></a>

* [AngularJS v1.4.7](https://angularjs.org/)
* [Bootstrap v2.3.2](http://getbootstrap.com/2.3.2)
* [jQuery v1.11.3](https://jquery.com/)
* [Underscore v1.8.3](http://underscorejs.org/)

## Basic setup <a name="basic_setup"></a>

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Angular Query Builder</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="libraries/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="libraries/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
    <link href="main.css" rel="stylesheet">
</head>
<body ng-app="app">
    <div ng-controller="MainController">
        <div class="aqb-search-form">
            <form name="searchForm" ng-submit="search(searchForm, $event)">
                <div class="aqb-search-form-body">
                    <div class="aqb-animate-combined" ng-repeat="group in searchContainer.groups | orderBy:'index'">
                        <div search-group
                                search-container="searchContainer"
                                groups="searchContainer.groups"
                                group-index="$index"
                                source-types="sourceTypes"
                                logical-operators="logicalOperators"></div>
                    </div>
                </div>
                <div class="aqb-search-form-footer">
                    <button type="submit" class="btn" ng-disabled="searchForm.$invalid">Search</button>
                </div>
            </form>
        </div>
        <div>
            <pre>{{jsonOutput}}</pre>
        </div>        
    </div>

    <script src="libraries/jquery/jquery.js"></script>
    <script src="libraries/bootstrap/js/bootstrap.js"></script>
    <script src="libraries/angular/angular.js"></script>
    <script src="libraries/angular/angular-animate.js"></script>
    <script src="libraries/underscore/underscore.js"></script>
    <script src="js/angular-query-builder-templates.min.js"></script>
    <script src="js/angular-query-builder.min.js"></script>
    <script src="main.js"></script>

</body>
</html>
```

main.js

```js
angular.module('app', [
    'angular-query-builder'
])

.controller('MainController', ['$scope', 'AppConfig', function ($scope, AppConfig) {

    AppConfig.setMaxGroups(4);
    AppConfig.setMaxConditions(4);

    $scope.jsonOutput = {};

    $scope.search = function (form, $event) {
        $scope.jsonOutput = JSON.stringify($scope.searchContainer, null, 4);
    };

    $scope.sourceTypes = [
        {
            "name": "Objects",
            "displayName": "Objects",
            "position": 1,
            "sourceFields": [
                {
                    "name": "ObjectId",
                    "displayName": "Id",
                    "position": 1,
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
                }
            ],
        }
    ];

    $scope.logicalOperators = [
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

    var defaultSearchContainer = {
        "groups": [
            {
                "sourceType": {
                    "name": "Objects",
                    "displayName": "Objects"
                },                
                "conditions": [
                    {}
                ]
            }
        ]
    };
    $scope.searchContainer = defaultSearchContainer;
}]);
```

## Building process <a name="building"></a>

After installing [Node.js](https://nodejs.org/) and [Grunt](https://gruntjs.com/) just run:

    npm install
    grunt release
