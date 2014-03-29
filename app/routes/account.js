"use strict";
var accountModel = require('../models/account.js'),
    passport = accountModel.getPassport,
    Model = accountModel.getModel;

exports.showLoginPage = function (req, res) {
    console.log("Login in page");
    res.render('login');
};

exports.loginUser = function (req, res) {
    console.log(req);
    res.send({
        user : {
            username: req.user.username, 
            email: req.user.email, 
            nickname: req.user.nickname
        }
    });
};

exports.showRegisterPage = function (req, res) {
    res.render('register', {});
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
                return res.render('register', { account: account });
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
    app.get('/internal/login', this.showLoginPage);
    app.post('/internal/login', passport.authenticate('local'), this.loginUser);
    app.get('/internal/register', this.showRegisterPage);
    app.post('/internal/register', this.registerUser);
    app.get('/internal/logout', this.logoutUser);
};
