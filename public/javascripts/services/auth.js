var loginService = function($rootScope, $http, $location){
    "use strict";
    return function(username, password){
        $http.post('/internal/login', {
            username : username,
            password : password
        }).success(function (data) {
            $rootScope.user = data.user;
            $location.path('/');
            $rootScope.errors = {};
        }).error(function(data, status){
            $rootScope.errors = {
                other : 'Login failed, please confirm username and password is correct'
            };
        });         
    };
};

loginService.$inject = ['$rootScope', '$http', '$location'];

angular.module('mainApp').factory('loginService', loginService);

var logoutService = function($rootScope, $http, $location) {
    "use strict";
    return function() {
        $http.get('/internal/logout').success(function (data, status, headers, config) {
            $location.path('/login');
            $rootScope.user = undefined;
        });                        
    };
};

logoutService.$inject = ['$rootScope', '$http', '$location'];

angular.module('mainApp').factory('logoutService', logoutService);

