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