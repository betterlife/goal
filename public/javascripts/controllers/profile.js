var profileCtrl = function ($scope, $rootScope, $http, $location, loginService, $routeParams) {
    "use strict";
    $scope.account = loginService.getLoggedInUser();

    $scope.updateProfile = function () {
        $http.put('/api/profile/' + $scope.account._id, {
            'account' : $scope.account
        }).success(function (data) {
            console.dir(data);
            $location.path('/profile');
        });
    };
};

profileCtrl.$inject = ['$scope', '$rootScope', '$http', '$location', 'loginService', '$routeParams'];

angular.module('mainApp').controller('profileCtrl', profileCtrl);