exports.isLoggedIn = function (req, res, next) {
    "use strict";
    if (req.user && req.isAuthenticated()) {
        next();
    } else {
        res.send({
            "error": true,
            "errorCode": 1
        });
    }
};