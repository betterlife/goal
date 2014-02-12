/*
 * GET home page.
 */
"use strict";
var goalModel = require('../models/goal.js');
var env;

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

exports.registerMe = function(app) {
    env = app.get('env');
    app.get('/partials/:objectType/:name', this.partials);
};

exports.catchAll = function(app){
    app.use(function(req, res){
        res.render('index', {
            title : 'Index Page',
            env   : env
        });
    });
};