var createCtrl = function($scope, $http, $location, $routeParams) {
    "use strict";
    $scope.action = "Create";
    $scope.goal = { createDate : new Date()};
    $scope.save = function () {
        $scope.goal.userId = $scope.user._id;
        $http.post('/goals', {
            'goal' : $scope.goal
        }).success(function (data) {
            $location.path('/goal/list');
        });
    };
};

createCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

angular.module('mainApp').controller('createCtrl', createCtrl);
