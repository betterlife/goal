/*
 * GET home page.
 */
"use strict";
var goalModel = require('../models/goal.js');

exports.index = function (req, res) {
    res.render('index', { title: 'Index Page' });
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

exports.registerMe = function(app) {
    app.get('/', this.index);
    app.get('/partials/:objectType/:name', this.partials);
};