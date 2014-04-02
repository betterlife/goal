var navController = function($scope, $rootScope, $http, $location, $routeParams) {
    "use strict";
    $scope.isActive = function(route) {
        return route === $location.path();        
    };
};

navController.$inject = ['$scope', '$rootScope', '$http', '$location', '$routeParams'];

angular.module('mainApp').controller('navController', navController);
