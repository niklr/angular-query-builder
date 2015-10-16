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