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

    goalService.setUpcomingGoal($scope);
    goalService.setCurrentYearGoal($scope);
    goalService.setCurrentMonthGoal($scope);
    goalService.setCurrentWeekGoal($scope);

    $scope.finishGoal = function (goal, goals, listName) {
        goalService.finishGoal(goal._id, $scope, listName, function(data) {
            goalService.setUpcomingGoal($scope);
        });
    };

    $scope.finishUpcomingGoal = function () {
        var id = $scope.upcomingGoal[0]._id;
        if (id !== null && id !== undefined) {
            goalService.finishGoal(id, undefined, undefined, function (data) {
                goalService.setUpcomingGoal($scope);
            });
        }
    };

};

dashboardCtrl.$inject = ['$scope', '$http', '$location', 'dueDateService', 'goalService', '$routeParams'];

angular.module('mainApp').controller('dashboardCtrl', dashboardCtrl);