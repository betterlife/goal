/*
 * GET home page.
 */
"use strict";
var goalModel = require('../models/goal.js'), env;

exports.index = function (req, res) {
    res.render('index', { user : req.user, env: env  });
};

exports.partials = function (req, res) {
    var name = req.params.name,
        objectType = req.params.objectType,
        types = goalModel.getGoalTypes(),
        statuses = goalModel.getStatuses();
    res.render('partials/' + objectType + '/' + name, {
        goalTypes: types,
        goalStatuses: statuses
    });
};

exports.templates = function (req, res) {
    var name = req.params.name;
    res.render('templates/' + name);
};

exports.registerMe = function (app) {
    env = app.settings.env;
    app.get('/', this.index);
    app.get('/partials/:objectType/:name', this.partials);
    app.get('/templates/:name', this.templates);
};

exports.catchAll = function (app) {
    app.use(function (req, res) {
        res.render('index', {
            user: req.user,
            env : env
        });
    });
};
