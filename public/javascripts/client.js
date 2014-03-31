// Declare app level module which depends on filters, and services
(function() {
    "use strict";

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
                             controller: listCtrl,
                             authenticate: true
                         }).
                         when('/goal/list', {
                             templateUrl: '/partials/goal/list',
                             controller: listCtrl,
                             authenticate: true
                         }).
                         when('/goal/delete/:id', {
                             templateUrl: '/partials/goal/delete',
                             controller: listCtrl,
                             authenticate: true
                         }).
                         when('/goal/add', {
                             templateUrl: '/partials/goal/edit',
                             controller: createCtrl,
                             authenticate: true
                         }).
                         when('/goal/edit/:id', {
                             templateUrl: '/partials/goal/edit',
                             controller: editCtrl,
                             authenticate: true
                         }).
                         when('/goal/view/:id', {
                             templateUrl : '/partials/goal/view',
                             controller: viewCtrl,
                             authenticate: true
                         }).
                         when('/login', {
                            templateUrl : '/partials/account/login',
                            controller: loginCtrl
                         }).
                         when('/logout', {
                             templateUrl : '/partials/account/login',
                             controller: logoutCtrl,
                             authenticate: true
                         }).
                         when('/register', {
                             templateUrl : '/partials/account/register',
                             controller: registerCtrl
                         }).
                         otherwise({
                             redirectTo: '/'
                         });
                     $locationProvider.html5Mode(true);
                 }])
        .run(['$rootScope', '$location', 'loginService', 
              function ($rootScope, $location, loginService) {
                  // Redirect to login if route requires auth and you're not logged in
                  $rootScope.$on('$routeChangeStart', function (event, next) {
                      if (next.authenticate && !loginService.isLoggedIn()) {
                          $location.path('/login');
                      }
                  });
              }]);
})();
