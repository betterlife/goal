var loginCtrl = function($scope, $http, loginService, $location, $routeParams) {
    "use strict";
    $scope.login = function() {
        var username = $scope.username,
        password = $scope.password;
        if (username !== undefined && username !== '' && 
            password !== undefined && password !== '') {
            loginService(username, password);
        } else {
            $scope.errors = {
                other : "Please input both username and password to login"
            }; 
        }
    };
};

loginCtrl.$inject = ['$scope', '$http', 'loginService', '$location', '$routeParams'];

var logoutCtrl = function($scope, $http, $location, $routeParams, logoutService) {
    "use strict";
    logoutService();
};

logoutCtrl.$inject = ['$scope', '$http', '$location', '$routeParams', 'logoutService'];

angular.module('mainApp').controller('loginCtrl', loginCtrl);
angular.module('mainApp').controller('logoutCtrl', logoutCtrl);
