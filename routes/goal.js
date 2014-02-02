/*jshint node:true */
"use strict";
var goalModel = require('../models/goal.js');
var persistent = require('mongoose');
var mongodbUrl = process.env.MONGOHQ_URL || 'mongodb://localhost/test';
var modelUtil = require('../util/modelUtil.js');
persistent.connect(mongodbUrl);
var Model = goalModel.getModel(persistent);

exports.list = function (req, res) {
    return Model.find(function (err, goals) {
        if (!err) {
            return res.send({'goals': goals});
        }
        return console.log(err);
    });
};

exports.create = function (req, res) {
    var goal;
    goal = new Model({
        title: req.body.goal.title,
        description: req.body.goal.description,
        type: req.body.goal.type,
        status: req.body.goal.status,
        createDate: req.body.createDate
    });
    return modelUtil.saveToDb(goal, res); 
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

exports.get = function (req, res) {
    return Model.findById(req.params.id, function (err, goal) {
        if (!err) {
            return res.send({'goal' : goal});
        }
        return console.log(err);
    });
};

exports.update = function (req, res) {
    return Model.findById(req.params.id, function (err, goal) {
        goal.title = req.body.goal.title;
        goal.description = req.body.goal.description;
        goal.type = req.body.goal.type;
        goal.status = req.body.goal.status;
        return modelUtil.saveToDb(goal, res); 
    });
};

exports.remove = function (req, res) {
    return Model.findById(req.params.id, function (err, goal) {
        return goal.remove(function (err) {
            if (err) {
                console.log(err);
            }
            return res.send('');
        });
    });
};
