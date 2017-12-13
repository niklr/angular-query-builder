Angular Query Builder
=========

Demo: http://niklr.github.io/angular-query-builder

This is a sample HTML / JavaScript application that demonstrates how to use AngularJS in combination with Bootstrap to create a dynamic query building web user interface.

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
* [Configuration](#configuration)
* [Terminology](#terminology)
* [Building](#building)

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
            "sourceFields": [
                {
                    "name": "ObjectId",
                    "displayName": "Id",
                    "comparisonOperators": [
                        {
                            "name": "Equals",
                            "displayName": "="
                        },
                        {
                            "name": "NotEquals",
                            "displayName": "!="
                        }
                    ]
                }
            ],
        }
    ];

    $scope.logicalOperators = [
        {
            "name": "And",
            "displayName": "AND"
        },
        {
            "name": "Or",
            "displayName": "OR"
        }
    ];

    var defaultSearchContainer = {
        "groups": [
            {
                "sourceType": {
                    "name": "Objects",
                    "displayName": "Objects"
                },
                "logicalOperator": {
                    "name": "And",
                    "displayName": "AND"
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

## Configuration <a name="configuration"></a>

* `AppConfig.setMaxGroups` Sets the maximum amount of groups the user is able to create.
* `AppConfig.setMaxConditions` Sets the maximum amount of conditions the user is able to create.

## Terminology <a name="terminology"></a>

Angular Query Builder differentiates between `SearchContainer`, `Group`, `Condition`, `SourceType`, `SourceField`, `ComparisonOperator`, `LogicalOperator` and `InputItem`. Each object can be dynamically defined within the $scope of the AngularJS controller.

* `SearchContainer` can contain one or multiple `Group`.
* `Group` consists of a `SourceType`, `LogicalOperator` and one or multiple `Condition`.
* `Condition` consists of a `SourceField`, `ComparisonOperator` and an `InputItem`.
* `SourceType` basically represents the source to be searched. It is possible to define multiple `SourceType` but in most cases one is sufficient. The `SourceType` object consists of the following keys:
  * `name` is a string
  * `displayName` is a string
  * `sourceFields` is an array of `SourceField` objects
* `SourceField` defines the available options for the first dropdown element of each `Condition`. The `SourceField` object consists of the following keys:
  * `name` is a string
  * `displayName` is a string
  * `comparisonOperators` is an array of `ComparisonOperator` objects
* `ComparisonOperator` defines the available options for the second dropdown element of each `Condition`. The `ComparisonOperator` object consists of the following keys:
  * `name` is a string
  * `displayName` is a string
* `LogicalOperator` defines how each `Condition` in a `Group` should be logically connected. The `LogicalOperator` object consists of the following keys:
  * `name` is a string
  * `displayName` is a string  
* `InputItem` contains the data entered by the user. The `InputItem` object consists of the following keys:
  * `data` is a string
  * `displayName` is a string

## Building <a name="building"></a>

In order to build Angular Query Builder, ensure that you have [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/) installed.

Clone a copy of the repo:

```bash
git clone https://github.com/niklr/angular-query-builder.git
```

Change to the angular-query-builder directory:

```bash
cd angular-query-builder
```

Install [Grunt](https://gruntjs.com/) and dev dependencies:

```bash
npm install -g grunt-cli
npm install
```

Use one of the following to build:

```
grunt release               # Builds into dist
grunt release-watch         # Same as release + watching for changes
```
