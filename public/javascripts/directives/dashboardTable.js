var dashboardGoalTable = function () {
    "use strict";
    return {
        restrict: 'E',
        scope: {
            title      : '=',
            clazz      : '=',
            goals      : '=',
            eventHandler: '&ngClick',
            list       : '='
        },
        templateUrl : '/javascripts/directives/dashboardTable.html',
        link: function (scope, element, attrs) {
        }
    };
};

angular.module('mainApp').directive('dashboardTable', dashboardGoalTable);