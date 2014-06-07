var emptyListPanel = function () {
    "use strict";
    return {
        restrict: 'E',
        scope: {
            title : '='
        },
        template : '<div class="panel col-sm-12 overdue-widget text-panel ng-scope">' +
          '<header>' +
            '<h2>&nbsp;</h2>' +
          '</header>' +
          '<section>' +
            '<p class="big-font">{{title}} &nbsp;&nbsp;<i class="glyphicon glyphicon-ok goal-list-finish-icon"></i></p>' +
          '</section>' +
        '</div>',
        link: function (scope, element, attrs) {
        }
    };
};

angular.module('mainApp').directive('emptyListPanel', emptyListPanel);