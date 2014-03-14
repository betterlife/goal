var passport = require('passport');
var accountModel  = require('../models/account.js');
var persistent = require('mongoose');
var Model = accountModel.getModel(persistent);

exports.showLoginPage = function (req, res) {
    "use strict";
    console.info("I am here");
    res.render('login', {});
};

exports.loginUser = function (req, res) {
    "use strict";
    res.redirect('/');
};

exports.showRegisterPage = function (req, res) {
    "use strict";
    res.render('register', { });
};

exports.registerUser = function (req, res) {
    "use strict";
    Model.register(
        new Model({ username: req.body.username }),
        req.body.password, function (err, account) {
            if (err) {
                return res.render('register', { account: account });
            }
            res.redirect('/');
        });
};

exports.logoutUser = function (req, res) {
    "use strict";
    req.logout();
    res.redirect('/');
};

exports.registerMe = function (app) {
    "use strict";
    app.get('/login', this.showLoginPage);
    app.post('/login', passport.authenticate('local'), this.loginUser);
    app.get('/register', this.showRegisterPage);
    app.post('/register', this.registerUser);
    app.get('/logout', this.logoutUser);
};