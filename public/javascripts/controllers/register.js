var registerCtrl = function ($scope, $http, $location, loginService, $routeParams) {
    "use strict";
    if ($scope.errors === undefined) {
        $scope.errors = [];
    }
    $scope.register = function () {
        var signup = $scope.signup;
        if ($scope.errors === undefined) {
            $scope.errors = [];
        }
        if (signup !== undefined) {
            if (signup.username === undefined) {
                $scope.errors.push("Please input username");
            }
            if (signup.email === undefined) {
                $scope.errors.push("Please input email address");
            }
            if (signup.password === undefined) {
                $scope.errors.push("Please input password");
            }
            if (signup.password2 === undefined) {
                $scope.errors.push("Please input password confirmation");
            }
            if (signup.password !== signup.password2) {
                $scope.errors.push('Two password input is not the same, please confirm');
            }
            if ($scope.errors.length !== undefined && $scope.errors.length !== 0) {
                return;
            }
            $http.post('/api/register', {
                'account' : {
                    username: signup.username,
                    password: signup.password,
                    email: signup.email,
                    nickname: $scope.signup.nickname
                }
            }).success(function (data, status, headers, config) {
                if (data.error !== undefined) {
                    $scope.errors.push(data.error.message);
                    return;
                } else {
                    $scope.regSuccess = true;
                    setTimeout(function () {
                        loginService.login(signup.username, signup.password);
                    }, 1000);
                }
            });
        } else {
            $scope.errors.push("Please input all required data above");
            return;
        }
    };
};

registerCtrl.$inject = ['$scope', '$http', '$location', 'loginService', '$routeParams'];

angular.module('mainApp').controller('registerCtrl', registerCtrl);
