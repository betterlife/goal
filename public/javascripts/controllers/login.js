"use strict";

var loginCtrl = function($scope, $http, $location, $routeParams) {
    $scope.login = function() {
        var username = $scope.username,
        password = $scope.password;
        if (username !== undefined && username !== '' && 
        password !== undefined && password !== '') {
            $http.post('/internal/login', {
                username : username,
                password : password
            }).success(function (data) {
                $scope.user = data.user;
                $location.path('/');
                if ($scope.errors === undefined){
                    $scope.errors = {};
                }
                $scope.errors.other = undefined;
            }).error(function(data, status){
                if ($scope.errors === undefined){
                    $scope.errors = {};
                }
                $scope.errors.other = 'Login failed, please confirm username and password is correct';
            }); 
        }
    };
};

loginCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

angular.module('mainApp').controller('loginCtrl', loginCtrl);
