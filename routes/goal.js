"use strict";
var goalModel = require('../models/goal.js');
var persistent = require('mongoose');
var mongodbUrl = process.env.MONGOHQ_URL || 'mongodb://localhost/test';
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
    goal.save(goal, function (err) {
        if (!err) {
            return console.log("created");
        }
        return console.log(err);
    });
    return res.send(goal);
};

exports.createNote = function (req, res) {
    return Model.findById(req.params.id, function (err, goal) {
        goal.comments.push({
            'content' : req.body.comment.content,
            'date'    : req.body.comment.date
        });
        return goal.save(function (err) {
            if (err) {
                console.log(err);
            }
            return res.send(goal);
        });
    });
};

exports.removeNote = function (req, res) {
    return res.send();
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
        return goal.save(function (err) {
            if (err) {
                console.log(err);
            }
            return res.send(goal);
        });
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
