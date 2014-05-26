var dashboardCtrl = function ($scope, $http, $location, dueDateService, goalService, $routeParams) {
    "use strict";

    var current = new Date().getTime(),
        getOverdueUrl = '/api/goals/0/' + current;

    $http.get(getOverdueUrl).success(function (data, status, headers, config) {
        if (data.error === true) {
            $location.url("/login");
        } else {
            $scope.overDueGoals = data.goals;
        }
    });

    $scope.finishGoal = function () {
        var id = this.goal._id, tempGoals = [];
        angular.forEach($scope.overDueGoals, function (value) {
            if (value._id !== id) {
                tempGoals.push(value);
            }
        });
        $scope.overDueGoals = tempGoals;
        goalService.finishGoal(id, function (data) {
            $("#overdue_item_" + id).fadeOut();
        });
    };

    $scope.goalDueDateMsg = function () {
        return dueDateService.goalDueDateMsg(this.goal);
    };
};

dashboardCtrl.$inject = ['$scope', '$http', '$location', 'dueDateService', 'goalService', '$routeParams'];

angular.module('mainApp').controller('dashboardCtrl', dashboardCtrl);