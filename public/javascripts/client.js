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
                $location.path('/goal/list');
            });
        };
    };

    createCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

    var srCreateCtrl = function($scope, $http, $location, $routeParams) {
        $scope.action = "Create";
        $scope.goal = { createDate : new Date()};
        $scope.save = function () {
            $http.post('/sr', {
                'record' : $scope.record
            }).success(function (data) {
                $location.path('/sr/list');
            });
        };
    };

    srCreateCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

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
                $location.path('/goal/list');
            });
        };
    };

    editCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

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
                    $location.path('/goal/list');
                });
            });
        };

        $scope.home = function () {
            $location.url('/goal/list');
        };
    };

    listCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

    var srListCtrl = function ($scope, $http, $location, $routeParams) {
           $http.get('/srs').success(function (data, status, headers, config) {
               $scope.records = data.records;
           });

           $scope.deleteSr = function () {
               if(window.confirm("Are you sure to delete this goal?")){
                   var id = this.goal._id;
                   $http.delete('/sr/' + id).success(function (data) {
                       $("#item_" + id).fadeOut();
                   });
               }
           };

           $scope.home = function () {
               $location.url('/sr/list');
           };
       };

    srListCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

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
            $http.post('/goal/notes/' + id, {
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
                $http.delete('/goal/notes/' + id + '/' + noteId).success(function (data) {
                    $http.get('/goals/' + id).success(function (data, status, headers, config) {
                        $scope.goal = clientUtil.bindGoalView(data.goal, 'notes');
                    });
                });
            }
        };
    };

    viewCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

    angular.module('mainApp', ['ngRoute'])
        .filter('to_trusted', ['$sce', function($sce){
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }])
        .config(['$routeProvider','$locationProvider',
                 function ($routeProvider, $locationProvider) {
                     $routeProvider.
                         when('/', {
                             templateUrl: '/partials/goal/list',
                             controller: listCtrl
                         }).
                         when('/goal/list', {
                             templateUrl: '/partials/goal/list',
                             controller: listCtrl
                         }).
                         when('/goal/delete/:id', {
                             templateUrl: '/partials/goal/delete',
                             controller: listCtrl
                         }).
                         when('/goal/add', {
                             templateUrl: '/partials/goal/edit',
                             controller: createCtrl
                         }).
                         when('/goal/edit/:id', {
                             templateUrl: '/partials/goal/edit',
                             controller: editCtrl
                         }).
                         when('/goal/view/:id', {
                             templateUrl : '/partials/goal/view',
                             controller: viewCtrl
                         }).
                         when('/sr/list', {
                              templateUrl: '/partials/sr/list',
                              controller: srListCtrl
                          }).
                         when('/sr/add', {
                             templateUrl: '/partials/sr/edit',
                             controller: srCreateCtrl
                         }).
                         otherwise({
                             redirectTo: '/'
                         });
                     $locationProvider.html5Mode(true);
                 }]);
})();
