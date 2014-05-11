"use strict";

var listArchivedCtrl = function ($scope, $http, $modal, $location, $routeParams) {
    $http.get('/api/goals/archived').success(function (data, status, headers, config) {
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

    $scope.home = function () {
        $location.url('/goal/list');
    };
};

listArchivedCtrl.$inject = ['$scope', '$http', '$modal', '$location', '$routeParams'];

angular.module('mainApp').controller('listArchivedCtrl', listArchivedCtrl);
