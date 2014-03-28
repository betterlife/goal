"use strict";
var accountModel = require('../models/account.js'),
    passport = accountModel.getPassport,
    Model = accountModel.getModel;

exports.showLoginPage = function (req, res) {
    res.render('login', { user: req.user, message: req.session.messages });
};

exports.loginUser = function (req, res) {
    res.redirect('index');
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
    req.logout();
    res.redirect('/');
};

exports.registerMe = function (app) {
    app.get('/login', this.showLoginPage);
    app.post('/login', passport.authenticate('local'), this.loginUser);
    app.get('/register', this.showRegisterPage);
    app.post('/register', this.registerUser);
    app.get('/logout', this.logoutUser);
};