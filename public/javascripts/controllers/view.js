'use strict';

var viewCtrl = function ($scope, $http, $location, $modal, dueDateService, $routeParams) {
    var id = $routeParams.id;
    $http.get('/api/goals/' + id).success(function (data, status, headers, config) {
        $scope.goal = data.goal;
        $scope.showNotePanel = ($scope.goal.comments.length > 0);
    });

    $scope.toggleAddNoteForm = function () {
        if ($scope.showAddNoteForm !== true) {
            if (!$scope.comment) {
                $scope.comment = {};
            }
            $scope.comment.date = new Date();
            $scope.showAddNoteForm = true;
        } else {
            $scope.showAddNoteForm = false;
        }
    };

    $scope.saveNote = function () {
        $http.post('/api/goal/notes/' + id, {
            'comment' : $scope.comment
        }).success(function (data) {
            $scope.toggleAddNoteForm();
            $scope.comment = undefined;
            $http.get('/api/goals/' + id).success(function (data, status, headers, config) {
                $scope.goal = data.goal;
                $scope.showNotePanel = ($scope.goal.comments.length > 0);
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
            $http.delete('/api/goal/notes/' + id + '/' + noteId).success(function (data) {
                $http.get('/api/goals/' + id).success(function (data, status, headers, config) {
                    $scope.goal = data.goal;
                    $scope.showNotePanel = ($scope.goal.comments.length > 0);
                });
            });
        }, function () {
            console.debug('Modal dismissed at: ' + new Date());
        });
    };
};

viewCtrl.$inject = ['$scope', '$http', '$location', '$modal', 'dueDateService', '$routeParams'];

angular.module('mainApp').controller('viewCtrl', viewCtrl);
