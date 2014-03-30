"use strict";
var accountModel = require('../models/account.js'),
    passport = accountModel.getPassport,
    Model = accountModel.getModel;

exports.loginUser = function (req, res) {
    console.log("Login user here");
    console.log(req);
    res.send({
        user : {
            username: req.user.username, 
            email: req.user.email, 
            nickname: req.user.nickname
        }
    });
};

exports.registerUser = function (req, res) {
    console.log(req.body);
    Model.register(
        new Model({
            username: req.body.username,
            email: req.body.email,
            nickname: req.body.nickname
        }),
        req.body.password,
        function (err, account) {
            if (err) {
                console.error(err);
                return res.send({ account: account });
            }
            res.redirect('/');
        }
    );
};

exports.logoutUser = function (req, res) {
    console.log("Logout user");
    req.logout();
    res.redirect('/');
};

exports.registerMe = function (app) {
    app.post('/internal/login', passport.authenticate('local'), this.loginUser);
    app.post('/internal/register', this.registerUser);
    app.get('/internal/logout', this.logoutUser);
};
