"use strict";
var accountModel = require('../models/account.js'),
    passport = accountModel.getPassport,
    Model = accountModel.getModel;

exports.loginUser = function (req, res) {
    
    res.send({
        user : {
            _id      : req.user._id,
            username : req.user.username, 
            email    : req.user.email, 
            nickname : req.user.nickname
        }
    });
};

exports.registerUser = function (req, res) {
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
    req.logout();
    res.redirect('/');
};

exports.registerMe = function (app) {
    app.post('/api/login', passport.authenticate('local'), this.loginUser);
    app.post('/api/register', this.registerUser);
    app.get('/api/logout', this.logoutUser);
};
