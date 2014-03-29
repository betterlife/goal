// Declare app level module which depends on filters, and services
(function() {
    "use strict";

    var loginCtrl = function($scope, $http, $location, $routeParams) {
        $scope.login = function() {
            var username = $scope.username,
                password = $scope.password;
            if (username !== undefined && username !== '' && 
                password !== undefined && password !== '') {
                $http.post('/internal/login').success(function (data) {
                    $scope.user = data.user;
                    $location.path('/');
                    if ($scope.errors === undefined){
                        $scope.errors = {};
                    }
                    $scope.errors.other = undefined;
                }).error(function(data, status){
                    if ($scope.errors === undefined){
                        $scope.errors = {};
                    }
                    $scope.errors.other = 'Login failed, please confirm username and password is correct';
                }); 
            }
        };
    };

    loginCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

    var logoutCtrl = function($scope, $http, $location, $routeParams) {
        $http.get('/internal/logout').success(function (data, status, headers, config) {
            console.log("I am here for logout");
            $location.path('/login');
        });                        
    };

    logoutCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

    var registerCtrl = function($scope, $http, $location, $routeParams) {
    };

    registerCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

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

    var modalInstanceCtrl = function ($scope, $modalInstance, modalData) {
        $scope.modalData = modalData;
        $scope.id = modalData.id;
        $scope.ok = function () {
            $modalInstance.close($scope.id);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    modalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'modalData'];

    var listCtrl = function ($scope, $http, $modal, $location, $routeParams) {
        $http.get('/goals').success(function (data, status, headers, config) {
            $scope.goals = data.goals;
        });

        $scope.deleteGoal = function () {
            var id = this.goal._id;
            var modalInstance = $modal.open({
                templateUrl: '/templates/modal',
                controller: modalInstanceCtrl,
                resolve: {
                    modalData : function () {
                        return {
                            title    : "Do you really want to delete the goal?",
                            body     : "This deletion operation can not be undo",
                            yesLabel : "Yes",
                            noLabel  : "No",
                            id       : id
                        };
                    }
                }
              });
            modalInstance.result.then(function (id) {
                $http.delete('/goals/' + id).success(function (data) {
                    $("#item_" + id).fadeOut();
                });
             }, function () {
               console.debug('Modal dismissed at: ' + new Date());
             });
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

    listCtrl.$inject = ['$scope', '$http', '$modal', '$location', '$routeParams'];

    var viewCtrl = function($scope, $http, $location, $modal, $routeParams) {
        var id = $routeParams.id;
        $http.get('/goals/' + id).success(function (data, status, headers, config) {
            $scope.goal = clientUtil.bindGoalView(data.goal, 'notes');
        });

        $scope.toggleAddNoteForm = function () {
            var formDiv = $('#add-note-form');
            if (formDiv.hasClass('hidden')) {
                formDiv.removeClass('hidden');
                formDiv.fadeIn();
                $scope.comment = {
                   date    : new Date(),
                   content : null
                };
            } else {
                formDiv.addClass('hidden');
                formDiv.fadeOut();
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
            var noteId = this.comment._id,
                modalInstance = $modal.open({
                    templateUrl: '/templates/modal',
                    controller: modalInstanceCtrl,
                    resolve: {
                        modalData: function () {
                            return {
                                title : "Do you really want to delete this note?",
                                body  : "This deletion operation can not be undo",
                                yesLabel: "Delete it",
                                noLabel: "Dismiss",
                                id: noteId
                        };
                    }
                }
            });
            modalInstance.result.then(function (noteId) {
                $http.delete('/goal/notes/' + id + '/' + noteId).success(function (data) {
                    $http.get('/goals/' + id).success(function (data, status, headers, config) {
                        $scope.goal = clientUtil.bindGoalView(data.goal, 'notes');
                    });
                });
            }, function () {
                console.debug('Modal dismissed at: ' + new Date());
            });
        };
    };

    viewCtrl.$inject = ['$scope', '$http', '$location', '$modal', '$routeParams'];

    angular.module('mainApp', ['ngRoute', 'ui.bootstrap'])
        .filter('to_trusted', ['$sce', function($sce){
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }])
        .directive('jqdatepicker', function () {
            return {
                restrict: "A",
                require: "ngModel",
                link: function (scope, elem, attrs, ngModelCtrl) {
                    var updateModel = function (dateText) {
                        // call $apply to bring stuff to angular model
                        scope.$apply(function () {
                            ngModelCtrl.$setViewValue(dateText);
                        });
                    };

                    var options = {
                        dateFormat: "dd/mm/yy",
                        numberOfMonths: 3,
                        showButtonPanel: true,
                        // handle jquery date change
                        onSelect: function (dateText) {
                            updateModel(dateText);
                        }
                    };

                    // jqueryfy the element
                    elem.datepicker(options);
                }
            };
        })
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
                         when('/login', {
                            templateUrl : '/partials/account/login',
                            controller: loginCtrl
                         }).
                         when('/logout', {
                            templateUrl : '/partials/account/login',
                            controller: logoutCtrl
                         }).
                         when('/register', {
                            templateUrl : '/partials/account/register',
                            controller: registerCtrl
                         }).
                         otherwise({
                             redirectTo: '/'
                         });
                     $locationProvider.html5Mode(true);
                 }]);
})();
