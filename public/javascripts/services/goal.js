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

    var getGoalAndSetArray = function (scope, start, end, key) {
        $http.get('/api/goals/' + start + '/' + end)
            .success(function (data, status, headers, config) {
                if (data.error === true) {
                    $location.url("/login");
                } else {
                    scope[key] = data.goals;
                }
            });
    };

    internal.setCurrentYearGoal = function (scope) {
        var currentDate = new Date(), endOfYear = new Date();
        endOfYear.setFullYear(currentDate.getFullYear(), 12, 31);
        getGoalAndSetArray(scope, currentDate.getTime(), endOfYear.getTime(), 'currentYearGoals');
    };

    internal.setCurrentMonthGoal = function (scope) {
        var currentDate = new Date(),
            start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        getGoalAndSetArray(scope, start.getTime(), end.getTime(), 'currentMonthGoals');
    };

    internal.setCurrentWeekGoal = function (scope) {
        var currentDate = new Date(),
            start = currentDate.getDate() - currentDate.getDay(),
            end = start + 6;
        var firstDay = new Date(currentDate.setDate(start));
        var lastDay = new Date(currentDate.setDate(end));
        getGoalAndSetArray(scope, firstDay.getTime(), lastDay.getTime(), 'currentWeekGoals');
    };
    return internal;
};

goalService.$inject = ['$rootScope', '$http', '$location'];

angular.module('mainApp').factory('goalService', goalService);

