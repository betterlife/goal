/*
 * GET home page.
 */
"use strict";
var goalModel = require('../models/goal.js');
var srModel = require('../models/sr.js');
var env;

exports.partials = function (req, res) {
    var name = req.params.name,
        objectType = req.params.objectType,
        stockIndustries = srModel.getIndustries(),
        stockBrokers = srModel.getBrokers(),
        stockRecommendLevels = srModel.getRecommendLevels(),
        stockPriceDateScope = srModel.getDateScope(),
        types = goalModel.getGoalTypes(),
        statuses = goalModel.getStatuses();
    res.render('partials/' + objectType + '/' + name, {
        goalTypes: types,
        goalStatuses: statuses,
        stockIndustries: stockIndustries,
        stockBrokers : stockBrokers,
        stockRecommendLevels : stockRecommendLevels,
        stockPriceDateScope : stockPriceDateScope
    });
};

exports.templates = function(req, res) {
    var name = req.params.name;
    res.render('templates/' + name);
};

exports.registerMe = function(app) {
    env = app.get('env');
    app.get('/partials/:objectType/:name', this.partials);
    app.get('/templates/:name', this.templates);
};

exports.catchAll = function(app){
    app.use(function(req, res){
        res.render('index', {
            title : 'Index Page',
            env   : env
        });
    });
};