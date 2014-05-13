/**
 * Created by larry on 14-5-13.
 */

moment.lang('en', {
    calendar : {
        lastDay : '[Yesterday] ',
        sameDay : '[Today] ',
        nextDay : '[Tomorrow] ',
        lastWeek : '[Last] dddd ',
        nextWeek : '[Next] dddd ',
        sameElse : 'L'
    }
});

var dueDateService = function ($rootScope, $http, $location) {
    "use strict";
    var internal = {};
    internal.dateOptions = {
        changeYear: true,
        changeMonth: true
    };

    internal.goalDueDateMsg = function (goal) {
        var date, m, prefix, diff, thisMoment;
        if (goal !== undefined) {
            date = goal.dueDate;
            if (undefined === date || null === date) {
                return 'No Due Date';
            }
            m = moment(date);
            if (null !== m) {
                thisMoment = moment(new Date());
                diff = m.diff(thisMoment, 'days');
                if (diff > 7 || diff < -7) {
                    prefix = m.format("dddd, MMMM Do YYYY");
                } else {
                    prefix = m.calendar();
                }
                return  prefix + " (" + m.fromNow() + ")";
            }
        }
        return ' ';
    };
    return internal;
};

dueDateService.$inject = ['$rootScope', '$http', '$location'];

angular.module('mainApp').factory('dueDateService', dueDateService);

