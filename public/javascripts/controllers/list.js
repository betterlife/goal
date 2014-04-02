"use strict";

var listCtrl = function ($scope, $http, $modal, $location, $routeParams) {
    $http.get('/api/goals').success(function (data, status, headers, config) {
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
            $http.delete('/api/goals/' + id).success(function (data) {
                $("#item_" + id).fadeOut();
            });
        }, function () {
            console.debug('Modal dismissed at: ' + new Date());
        });
    };

    $scope.finishGoal = function() {
        var id = this.goal._id;
        $http.get('/api/goals/' + id).success(function (data, status, headers, config) {
            var goal = data.goal;
            goal.status = 'Finished';
            $http.put('/api/goals/' + id, {
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

angular.module('mainApp').controller('listCtrl', listCtrl);
