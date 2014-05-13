"use strict";

var editCtrl = function ($scope, $http, $location, dueDateService, $routeParams) {
    var id = $routeParams.id;
    $http.get('/api/goals/' + id).success(function (data, status, headers, config) {
        $scope.goal = data.goal;
        if ($scope.goal.dueDate !== undefined) {
            $scope.goal.dueDate = new Date($scope.goal.dueDate);
        }
        $scope.action = "Update";
    });
    $scope.save = function () {
        $http.put('/api/goals/' + id, {
            'goal' : $scope.goal
        }).success(function (data) {
            $location.path('/goal/list');
        });
    };

    $scope.dateOptions = dueDateService.dateOptions;

    $scope.goalDueDateMsg = function () {
        return dueDateService.goalDueDateMsg($scope.goal);
    };
};

editCtrl.$inject = ['$scope', '$http', '$location', 'dueDateService', '$routeParams'];

angular.module('mainApp').controller('editCtrl', editCtrl);
