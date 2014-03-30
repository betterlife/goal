"use strict";

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

angular.module('mainApp').controller('modalInstanceCtrl', modalInstanceCtrl);
