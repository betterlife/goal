var goalService = function ($rootScope, $http, $location) {
    "use strict";
    var internal = {};
    internal.finishGoal = function (id, scope, listName, callback) {
        $http.get('/api/goals/' + id).success(function (data, status, headers, config) {
            var goal = data.goal;
            goal.status = 'Finished';
            $http.put('/api/goals/' + id, {
                'goal' : goal
            }).success(function (data) {
                var tempGoals = [];
                if (scope !== undefined && listName !== undefined) {
                    angular.forEach(scope[listName], function (value) {
                        if (value._id !== id) {
                            tempGoals.push(value);
                        }
                    });
                    scope[listName] = tempGoals;
                }
                if (callback !== null && callback !== undefined) {
                    callback(data);
                }
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

    internal.setCurrentYearGoal = function (scope) {
        var currentDate = new Date(), endOfYear = new Date(), start, end;
        endOfYear.setFullYear(currentDate.getFullYear(), 12, 31);
        start = currentDate.getTime();
        end = endOfYear.getTime();
        $http.get('/api/goals/' + start + '/' + end)
            .success(function (data, status, headers, config) {
                if (data.error === true) {
                    $location.url("/login");
                } else {
                    scope.currentYearGoals = data.goals;
                }
            });
    };

    internal.setCurrentMonthGoal = function (scope) {
        scope.currentMonthGoals = [];
    };

    internal.setCurrentWeekGoal = function (scope) {
        scope.currentWeekGoals = [];
    };
    return internal;
};

goalService.$inject = ['$rootScope', '$http', '$location'];

angular.module('mainApp').factory('goalService', goalService);

