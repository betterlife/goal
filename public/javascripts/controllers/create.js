var createCtrl = function($scope, $http, $location, loginService, dueDateService, $routeParams) {
    "use strict";
    $scope.action = "Create";
    $scope.goal = { createDate : new Date()};
    $scope.save = function () {
        var user = loginService.getLoggedInUser();
        if (null !== user && undefined !== user){
            $scope.goal.userId = user._id;
            $http.post('/api/goals', {
                'goal' : $scope.goal
            }).success(function (data) {
                $location.path('/api/goal/list');
            });
        } else {
            console.info("Current login user is null");
        }
    };

    $scope.dateOptions = dueDateService.dateOptions;

    $scope.goalDueDateMsg = function () {
        return dueDateService.goalDueDateMsg($scope.goal);
    };

};

createCtrl.$inject = ['$scope', '$http', '$location', 'loginService', 'dueDateService', '$routeParams'];

angular.module('mainApp').controller('createCtrl', createCtrl);
