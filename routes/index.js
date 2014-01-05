/*
 * GET home page.
 */
"use strict";
var goalModel = require('../models/goal.js');

exports.index = function (req, res) {
    res.render('index', { title: 'Goals' });
};

exports.partials = function (req, res) {
    var name = req.params.name,
        types = goalModel.getGoalTypes(),
        statuses = goalModel.getStatuses();
    res.render('partials/' + name, {
        goalTypes: types,
        goalStatuses: statuses
    });
};