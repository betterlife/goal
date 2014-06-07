// Declare app level module which depends on filters, and services
(function () {
    "use strict";

    angular.module('mainApp', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ui.date'])
        .filter('to_trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }])
        .config(['$routeProvider', '$locationProvider', '$tooltipProvider',
            function ($routeProvider, $locationProvider, $tooltipProvider) {
                $routeProvider.when('/', {
                        templateUrl: '/partials/goal/dashboard',
                        controller: dashboardCtrl,
                        authenticate: true
                    }).when('/goal/list', {
                        templateUrl: '/partials/goal/list',
                        controller: listCtrl,
                        authenticate: true
                    }).when('/goal/archived', {
                        templateUrl: '/partials/goal/list',
                        controller: listCtrl,
                        authenticate: true
                    }).when('/goal/delete/:id', {
                        templateUrl: '/partials/goal/delete',
                        controller: listCtrl,
                        authenticate: true
                    }).when('/goal/add', {
                        templateUrl: '/partials/goal/edit',
                        controller: createCtrl,
                        authenticate: true
                    }).when('/goal/edit/:id', {
                        templateUrl: '/partials/goal/edit',
                        controller: editCtrl,
                        authenticate: true
                    }).when('/goal/view/:id', {
                        templateUrl : '/partials/goal/view',
                        controller: viewCtrl,
                        authenticate: true
                    }).when('/login', {
                        templateUrl : '/partials/account/login',
                        controller: loginCtrl
                    }).when('/logout', {
                        templateUrl : '/partials/account/login',
                        controller: logoutCtrl,
                        authenticate: true
                    }).when('/register', {
                        templateUrl : '/partials/account/register',
                        controller: registerCtrl
                    }).otherwise({
                        redirectTo: '/'
                    });
                $locationProvider.html5Mode(true);
                $tooltipProvider.setTriggers({
                    'click' : 'mouseleave'
                });
                $tooltipProvider.options({
                    popupDelay: 50
                });
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

    // update popover template for binding unsafe html
    angular.module("template/popover/popover.html", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("template/popover/popover.html",
                           "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
                           "  <div class=\"arrow\"></div>\n" +
                           "\n" +
                           "  <div class=\"popover-inner\">\n" +
                           "      <h3 class=\"popover-title\" ng-bind-html=\"title | to_trusted\" ng-show=\"title\"></h3>\n" +
                           "      <div class=\"popover-content\"ng-bind-html=\"content | to_trusted\"></div>\n" +
                           "  </div>\n" +
                           "</div>\n" +
                           "");
    }]);
})();
