var registerCtrl = function ($scope, $http, $location, loginService, $routeParams) {
    "use strict";
    $scope.register = function () {
        var signup = $scope.signup;
        if (signup !== undefined) {
            $http.post('/api/register', {
                'account' : {
                    username: signup.username,
                    password: signup.password,
                    email: signup.email,
                    nickname: $scope.signup.nickname
                }
            }).success(function (data, status, headers, config) {
                if (data.error !== undefined) {
                    $scope.errors = [];
                    if (data.error.message !== undefined && data.error.message !== null) {
                        $scope.errors.push(data.error.message);
                    } else if (data.error.err !== undefined && data.error.err !== null) {
                        $scope.errors.push(data.error.err);
                    }
                } else {
                    $scope.regSuccess = true;
                    setTimeout(function () {
                        loginService.login(signup.username, signup.password);
                    }, 1000);
                }
            });
        } else {
            $scope.errors.push("Please input all required data above");
        }
    };
};

registerCtrl.$inject = ['$scope', '$http', '$location', 'loginService', '$routeParams'];

angular.module('mainApp').controller('registerCtrl', registerCtrl);
