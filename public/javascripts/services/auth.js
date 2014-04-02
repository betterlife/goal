var loginService = function($rootScope, $http, $location){
    "use strict";
    return {
        login : function(username, password){
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
        },
        
        isLoggedIn : function(){
            var user = $rootScope.user;
            return !!user;
        },

        logout : function(){
            $http.get('/internal/logout').success(function (data, status, headers, config) {
                $location.path('/login');
                $rootScope.user = undefined;
            });                        
        }
    };
};

loginService.$inject = ['$rootScope', '$http', '$location'];

angular.module('mainApp').factory('loginService', loginService);
