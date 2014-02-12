/*jshint node:true */
"use strict";
var goalModel  = require('../models/goal.js');
var persistent = require('mongoose');
var modelUtil  = require('../util/modelUtil.js');
var marked     = require('marked');
var Model = goalModel.getModel(persistent);

exports.list = function (req, res) {
    return Model.find(function (err, goals) {
        return modelUtil.constructResponse(res, err, {'goals' : goals});
    });
};

exports.create = function (req, res) {
    var goal;
    goal = new Model({
        title       : req.body.goal.title,
        description : req.body.goal.description,
        type        : req.body.goal.type,
        status      : req.body.goal.status,
        createDate  : req.body.goal.createDate
    });
    if (req.body.goal._id) {
        goal._id = req.body.goal._id;
    }
    return modelUtil.saveToDb(goal, res); 
};

exports.get = function (req, res) {
    return Model.findById(req.params.id, function (err, goal) {
        if (goal !== undefined && goal !== null) {
            var i = 0, comments = goal.comments, comment;
            for (i = 0; i < comments.length; i++){
                comments[i].content = marked(comments[i].content);
            }
        }
        return modelUtil.constructResponse(res, err, {'goal' : goal});
    });
};

exports.update = function (req, res) {
    var goal = {
        title       : req.body.goal.title,
        description : req.body.goal.description,
        type        : req.body.goal.type,
        status      : req.body.goal.status
    };
    var query   = {'_id' : req.params.id};
    var options = {'new' : true};
    return Model.findOneAndUpdate(query, goal, options, function (err, data) {
        return modelUtil.constructResponse(res, err, {'goal' : data});
    });
};

exports.remove = function (req, res) {
    return Model.findById(req.params.id, function (err, goal) {
        return goal.remove(function (err) {
            return modelUtil.constructResponse(res, err, {'goal' : goal});
        });
    });
};

exports.createNote = function (req, res) {
    return Model.findById(req.params.id, function (err, goal) {
        goal.comments.push({
            'content' : req.body.comment.content,
            'date'    : req.body.comment.date
        });
        return modelUtil.saveToDb(goal, res); 
    });
};

exports.removeNote = function (req, res) {
    return Model.findById(req.params.id, function (err, goal) {
        if (goal) {
            goal.comments.pull({
                '_id' : req.params.noteId
            });
        }
        return modelUtil.saveToDb(goal, res); 
    });
};

exports.registerMe = function(app) {
    app.get('/goals', this.list);
    app.post('/goals', this.create);
    app.get('/goals/:id', this.get);
    app.put('/goals/:id', this.update);
    app.delete('/goals/:id', this.remove);
    app.post('/goal/notes/:id', this.createNote);
    app.delete('/goal/notes/:id/:noteId', this.removeNote);
};
