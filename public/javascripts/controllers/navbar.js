var navController = function($scope, $rootScope, $http, $location, loginService, $routeParams) {
    "use strict";
    $scope.isActive = function(route) {
        return route === $location.path();        
    };

    $scope.isLoggedIn = function(){
        return loginService.isLoggedIn();
    };

    $scope.getLoggedInUserDisplay = function(){
        var user = loginService.getLoggedInUser();
        if (user.nickname !== null && user.nickname !== undefined){
            return user.nickname;
        }
        return user.username;
    };
};

navController.$inject = ['$scope', '$rootScope', '$http', '$location', 'loginService', '$routeParams'];

angular.module('mainApp').controller('navController', navController);
