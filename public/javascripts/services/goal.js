var goalService = function ($rootScope, $http, $location) {
    "use strict";
    var internal = {};
    internal.finishGoal = function (id, callback) {
        $http.get('/api/goals/' + id).success(function (data, status, headers, config) {
            var goal = data.goal;
            goal.status = 'Finished';
            $http.put('/api/goals/' + id, {
                'goal' : goal
            }).success(function (data) {
                callback(data);
            });
        });
    };

    internal.setUpcomingGoal = function (scope) {
        $http.get('/api/goals/upcoming').success(function (data, status, headers, config) {
            if (data.error === true) {
                $location.url("/login");
            } else {
                scope.upcomingGoal = data.goal;
            }
        });
    };
    return internal;
};

goalService.$inject = ['$rootScope', '$http', '$location'];

angular.module('mainApp').factory('goalService', goalService);

