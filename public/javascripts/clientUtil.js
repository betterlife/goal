var clientUtil = (function() {
    "use strict";
    return {
        bindGoalView : function(goal, commentUiContainerId) {
            if (goal.comments.length > 0) {
                $("#" + commentUiContainerId).removeClass('hidden'); 
            } else {
                $("#" + commentUiContainerId).addClass('hidden'); 
            }
            return goal;
        }
    };
}());
