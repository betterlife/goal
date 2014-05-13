/*jshint node:true */
"use strict";
var goalModel  = require('../models/goal.js'),
    modelUtil  = require('../util/modelUtil.js'),
    marked     = require('marked'),
    authUtil   = require('../util/authUtil.js'),
    Model      = goalModel.getModel();

var queryGoalsByStatus = function (req, res, statusWhere) {
    return Model.find({
        userId: req.user._id,
        status: statusWhere
    }, function (err, goals) {
        return modelUtil.constructResponse(res, err, {'goals' : goals});
    });
};

exports.list = function (req, res) {
    return queryGoalsByStatus(req, res, {$nin: goalModel.getArchivedStatuses()});
};

exports.listArchived = function (req, res) {
    return queryGoalsByStatus(req, res, {$in: goalModel.getArchivedStatuses()});
};

exports.create = function (req, res) {
    var goal = new Model({
        title: req.body.goal.title,
        description: req.body.goal.description === undefined ? '' : req.body.goal.description,
        type: req.body.goal.type,
        status: req.body.goal.status,
        dueDate: req.body.goal.dueDate,
        createDate: req.body.goal.createDate,
        userId: req.body.goal.userId
    });
    if (req.body.goal._id) {
        goal._id = req.body.goal._id;
    }
    return modelUtil.saveToDb(goal, res);
};

exports.get = function (req, res) {
    return Model.findById(req.params.id, function (err, goal) {
        if (goal !== undefined && goal !== null) {
            var i, comments = goal.comments;
            for (i = 0; i < comments.length; i++) {
                comments[i].content = marked(comments[i].content);
            }
        }
        return modelUtil.constructResponse(res, err, {'goal' : goal});
    });
};

exports.update = function (req, res) {
    var goal = {
            title: req.body.goal.title,
            description: req.body.goal.description === undefined ? '' : req.body.goal.description,
            type: req.body.goal.type,
            status: req.body.goal.status
        },
        query   = {'_id' : req.params.id},
        options = {'new' : true};
    if (req.body.goal.dueDate !== undefined) {
        goal.dueDate = req.body.goal.dueDate;
    }
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

exports.registerMe = function (app) {
    var checkLoggedIn = authUtil.isLoggedIn;
    app.get('/api/goals', checkLoggedIn, this.list);
    app.get('/api/goals/archived', checkLoggedIn, this.listArchived);
    app.post('/api/goals', checkLoggedIn, this.create);
    app.get('/api/goals/:id', checkLoggedIn, this.get);
    app.put('/api/goals/:id', checkLoggedIn, this.update);
    app.delete('/api/goals/:id', checkLoggedIn, this.remove);
    app.post('/api/goal/notes/:id', checkLoggedIn, this.createNote);
    app.delete('/api/goal/notes/:id/:noteId', checkLoggedIn, this.removeNote);
};
