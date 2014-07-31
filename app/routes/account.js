"use strict";
var accountModel = require('../models/account.js'),
    passport = accountModel.getPassport,
    authUtil   = require('../util/authUtil.js'),
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

exports.updateProfile = function (req, res) {
    var account = req.body.account;
    Model.findById(req.params.id, function (err, existingUser) {
        if (existingUser) {
            //Update password
            if (account.currentPassword) {
                existingUser.authenticate(account.currentPassword,
                    function (err, loggedInUser) {
                        if (err) {
                            res.send({
                                "error": "Failed to authenticate using current password"
                            });
                        } else {
                            //1. Set password
                            loggedInUser.setPassword(account.password1,
                                function (err, user) {
                                    if (err) {
                                        res.send({
                                            'error': 'Failed to update password'
                                        });
                                    }
                                });
                            //2. Update current information
                            Model.update({_id: req.params.id}, {
                                email: account.email,
                                nickname: account.nickname
                            }, function (err, user) {
                                if (err) {
                                    res.send({
                                        'error': 'Failed to update profile'
                                    });
                                } else {
                                    res.send({
                                        'message': 'Success to update profile and password'
                                    });
                                }
                            });
                        }
                    });
            } else {
                //Update current information (without password)
                Model.update({_id: req.params.id}, {
                    email: account.email,
                    nickname: account.nickname
                }, function (err, user) {
                    if (err) {
                        res.send({
                            'error': 'Failed to update profile'
                        });
                    } else {
                        res.send({
                            'message': 'Success to update profile'
                        });
                    }
                });
            }
        } else {
            res.send({
                'error' : 'The user account is not found'
            });
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
    var checkLoggedIn = authUtil.isLoggedIn;
    app.post('/api/login', passport.authenticate('local'), this.loginUser);
    app.post('/api/register', this.registerUser);
    app.put('/api/profile/:id', checkLoggedIn, this.updateProfile);
    app.get('/api/logout', this.logoutUser);
};
