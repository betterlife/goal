var createCtrl = function($scope, $http, $location, loginService, $routeParams) {
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
};

createCtrl.$inject = ['$scope', '$http', '$location', 'loginService', '$routeParams'];

angular.module('mainApp').controller('createCtrl', createCtrl);
