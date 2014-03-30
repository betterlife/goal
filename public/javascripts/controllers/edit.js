"use strict";

var editCtrl = function($scope, $http, $location, $routeParams) {
    var id = $routeParams.id;
    $http.get('/goals/' + id).success(function (data, status, headers, config) {
        $scope.goal = data.goal;
        $scope.action = "Update";
    });
    $scope.save = function () {
        $http.put('/goals/' + id, {
            'goal' : $scope.goal
        }).success(function (data) {
            $location.path('/goal/list');
        });
    };
};

editCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

angular.module('mainApp').controller('editCtrl', editCtrl);
