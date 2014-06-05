"use strict";
var accountModel = require('../models/account.js'),
    passport = accountModel.getPassport,
    Model = accountModel.getModel();

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
    var model = new Model({
        username : req.body.account.username,
        email    : req.body.account.email,
        nickname : req.body.account.nickname
    });
    if (req.body.account._id) {
        model._id = req.body.account._id;
    }
    Model.register(
        model,
        req.body.account.password,
        function (err, account) {
            if (err) {
                console.error(err);
                res.send({"error" : err});
            } else {
                res.send({
                    "__v"      : account.__v,
                    "_id"      : account._id,
                    "username" : account.username,
                    "email"    : account.email,
                    "nickname" : account.nickname
                });
            }
        }
    );
};

exports.logoutUser = function (req, res) {
    req.logout();
    delete req.session;
    res.redirect("/login");
};

exports.registerMe = function (app) {
    app.post('/api/login', passport.authenticate('local'), this.loginUser);
    app.post('/api/register', this.registerUser);
    app.get('/api/logout', this.logoutUser);
};
