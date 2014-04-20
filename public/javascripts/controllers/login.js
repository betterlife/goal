var loginCtrl = function ($scope, $http, loginService, $location, $routeParams) {
    "use strict";
    $scope.login = function () {
        var username = $scope.username,
        password = $scope.password;
        if (username !== undefined && username !== '' &&
            password !== undefined && password !== '') {
            loginService.login(username, password);
        } else {
            $scope.errors = {
                other : "Please input both username and password to login"
            };
        }
    };
};

loginCtrl.$inject = ['$scope', '$http', 'loginService', '$location', '$routeParams'];

var logoutCtrl = function ($scope, $http, $location, $routeParams, loginService) {
    "use strict";
    loginService.logout();
};

logoutCtrl.$inject = ['$scope', '$http', '$location', '$routeParams', 'loginService'];

angular.module('mainApp').controller('loginCtrl', loginCtrl);
angular.module('mainApp').controller('logoutCtrl', logoutCtrl);
