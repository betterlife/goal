"use strict";

var registerCtrl = function($scope, $http, $location, $routeParams) {
    $scope.register = function () {
        var signup = $scope.signup;
        if (signup !== undefined && signup.password !== signup.password2){
            if ($scope.errors === undefined){
                $scope.errors = {};
            }
            $scope.errors.other = 'Two password input is not the same, please confirm';
            return;
        }
        $http.post('/internal/register', {
            username: signup.username,
            password: signup.password,
            email:signup.email,
            nickname:$scope.signup.nickname
        }).success(function(data, status, headers, config){
            console.info("Register successfully");
            $location.path('/login');
        });
    };
};

registerCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

angular.module('mainApp').controller('registerCtrl', registerCtrl);
