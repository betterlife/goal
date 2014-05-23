"use strict";

var listCtrl = function ($scope, $http, $modal, $location, dueDateService, goalService, $routeParams) {
    var getUrl;

    if ($location.$$url === "/goal/archived") {
        getUrl = '/api/goals/archived';
    } else {
        getUrl = '/api/goals';
    }

    $http.get(getUrl).success(function (data, status, headers, config) {
        if (data.error === true) {
            $location.url("/login");
        } else {
            $scope.goals = data.goals;
        }
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


    $scope.finishGoal = function () {
        var id = this.goal._id;
        goalService.finishGoal(id);
    };

    $scope.home = function () {
        $location.url('/goal/list');
    };

    $scope.goalDueDateMsg = function () {
        return dueDateService.goalDueDateMsg(this.goal);
    };
};

listCtrl.$inject = ['$scope', '$http', '$modal', '$location', 'dueDateService', 'goalService', '$routeParams'];

angular.module('mainApp').controller('listCtrl', listCtrl);
