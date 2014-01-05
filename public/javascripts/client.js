// Declare app level module which depends on filters, and services
"use strict";

var createCtrl = function($scope, $http, $location, $routeParams) {
    $scope.action = "Create";
    $scope.goal = { createDate : new Date()};
    $scope.save = function () {
        $http.post('/goals', {
            'goal' : $scope.goal
        }).success(function (data) {
            $location.path('/');
        });
    };
};

var editCtrl = function($scope, $http, $location, $routeParams) {
    var id = $routeParams.id;
    $http.get('/goals/' + id).success(function (data, status, headers, config) {
        $scope.goal = data.goal;
        $scope.action = "Update";
    });
    $scope.save = function () {
        $http.put('/goals/' + id, {
            'goal' : $scope.goal
        }).success(function (data) {
            $location.path('/');
        });
    };
};

var listCtrl = function ($scope, $http, $location, $routeParams) {
    $http.get('/goals').success(function (data, status, headers, config) {
        $scope.goals = data.goals;
    });

    $scope.deleteGoal = function () {
        if(window.confirm("Are you sure to delete this goal?")){
            var id = this.goal._id;
            $http.delete('/goals/' + id).success(function (data) {
                $("#item_" + id).fadeOut();
            });
        }
    };

    $scope.finishGoal = function() {
        var id = this.goal._id;
        $http.get('/goals/' + id).success(function (data, status, headers, config) {
            var goal = data.goal;
            goal.status = 'Finished';
            $http.put('/goals/' + id, {
                'goal' : goal
            }).success(function (data) {
                $location.path('/list');
            });
        });
    };

    $scope.home = function () {
        $location.url('/');
    };
};

angular.module('goal', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            templateUrl: '/partials/list',
            controller: listCtrl
        }).
        when('/list', {
            templateUrl: '/partials/list',
            controller: listCtrl
        }).
        when('/delete/:id', {
            templateUrl: '/partials/delete',
            controller: listCtrl
        }).
        when('/add', {
            templateUrl: '/partials/edit',
            controller: createCtrl
        }).
        when('/edit/:id', {
            templateUrl: '/partials/edit',
            controller: editCtrl
        }).
        otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
});