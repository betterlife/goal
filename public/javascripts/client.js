// Declare app level module which depends on filters, and services
(function() {
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
                var id = this.comment._id;
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

    var viewCtrl = function($scope, $http, $location, $routeParams) {
        var id = $routeParams.id;
        $http.get('/goals/' + id).success(function (data, status, headers, config) {
            $scope.goal = clientUtil.bindGoalView(data.goal, 'notes');
        });

        $scope.toggleAddNoteForm = function () {
            var formDiv = $('#add-note-form');
            if (formDiv.hasClass('hidden')) {
                $('#add-note-form').removeClass('hidden');
                $('#add-note-form').fadeIn();
                $scope.comment = {
                   date    : new Date(),
                   content : null
                };
            } else {
                $('#add-note-form').addClass('hidden');
                $('#add-note-form').fadeOut();
            }
        };

        $scope.saveNote = function () {
            $http.post('/notes/' + id, {
               'comment' : $scope.comment 
            }).success(function (data) {
                $scope.toggleAddNoteForm();
                $http.get('/goals/' + id).success(function (data, status, headers, config) {
                    $scope.goal = clientUtil.bindGoalView(data.goal, 'notes');
                });
            });
        };

        $scope.deleteNote = function() {
            if(window.confirm("Are you sure to delete this note?")){
                var noteId = this.comment._id;
                $http.delete('/notes/' + id + '/' + noteId).success(function (data) {
                    $http.get('/goals/' + id).success(function (data, status, headers, config) {
                        $scope.goal = clientUtil.bindGoalView(data.goal, 'notes');
                    });
                });
            }
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
        when('/view/:id', {
            templateUrl : '/partials/view',
            controller: viewCtrl
        }).
        otherwise({
            redirectTo: '/'
        });
        $locationProvider.html5Mode(true);
    });
})();
