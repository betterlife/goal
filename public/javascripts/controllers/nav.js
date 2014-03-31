/*jshint global: angluar*/
"use strict";

var navController = function($scope, $http, $location, $modal, $routeParams) {
    $scope.isActive = function(route) {
      return route === $location.path();        
    };
};

navController.$inject = ['$scope', '$http', '$location', '$modal', '$routeParams'];

angular.module('mainApp').controller('navController', navController);
