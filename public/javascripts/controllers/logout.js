"use strict";

var logoutCtrl = function($scope, $http, $location, $routeParams) {
    $http.get('/internal/logout').success(function (data, status, headers, config) {
        console.log("I am here for logout");
        $location.path('/login');
    });                        
};

logoutCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

angular.module('mainApp').controller('logoutCtrl', logoutCtrl);
