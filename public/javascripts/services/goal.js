var goalService = function ($rootScope, $http, $location) {
    "use strict";
    var internal = {};
    internal.finishGoal = function (id) {
        $http.get('/api/goals/' + id).success(function (data, status, headers, config) {
            var goal = data.goal;
            goal.status = 'Finished';
            $http.put('/api/goals/' + id, {
                'goal' : goal
            }).success(function (data) {
                $("#item_" + id).fadeOut();
            });
        });
    };
    return internal;
};

goalService.$inject = ['$rootScope', '$http', '$location'];

angular.module('mainApp').factory('goalService', goalService);

