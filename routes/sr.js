/*jshint node:true */
"use strict";
var stockRecommendModel  = require('../models/sr.js');
var persistent = require('mongoose');
var modelUtil  = require('../util/modelUtil.js');
var marked     = require('marked');
var Model = stockRecommendModel.getModel(persistent);

exports.list = function (req, res) {
    return Model.find(function (err, records) {
        return modelUtil.constructResponse(res, err, {'records' : records});
    });
};

exports.create = function (req, res) {
    var record;
    record = new Model({
        title       : req.body.goal.title,
        description : req.body.goal.description,
        type        : req.body.goal.type,
        status      : req.body.goal.status,
        createDate  : req.body.goal.createDate
    });
    if (req.body.goal._id) {
        record._id = req.body.goal._id;
    }
    return modelUtil.saveToDb(record.res);
};

exports.get = function (req, res) {
    return Model.findById(req.params.id, function (err, record) {
        if (record !== undefined && record !== null) {
            var i = 0, comments = record.comments, comment;
            for (i = 0; i < comments.length; i++){
                comments[i].content = marked(comments[i].content);
            }
        }
        return modelUtil.constructResponse(res, err, {'record' : record});
    });
};

exports.update = function (req, res) {
    var record = {
        title       : req.body.goal.title,
        description : req.body.goal.description,
        type        : req.body.goal.type,
        status      : req.body.goal.status
    };
    var query   = {'_id' : req.params.id};
    var options = {'new' : true};
    return Model.findOneAndUpdate(query, record, options, function (err, record) {
        return modelUtil.constructResponse(res, err, {'record' : record});
    });
};

exports.remove = function (req, res) {
    return Model.findById(req.params.id, function (err, record) {
        return record.remove(function (err) {
            return modelUtil.constructResponse(res, err, {'record' : record});
        });
    });
};

exports.createNote = function (req, res) {
    return Model.findById(req.params.id, function (err, record) {
        record.comments.push({
            'content' : req.body.comment.content,
            'date'    : req.body.comment.date
        });
        return modelUtil.saveToDb(record, res);
    });
};

exports.removeNote = function (req, res) {
    return Model.findById(req.params.id, function (err, record) {
        if (record) {
            record.comments.pull({
                '_id' : req.params.noteId
            });
        }
        return modelUtil.saveToDb(record, res);
    });
};

exports.registerMe = function(app) {
    app.get('/sr', this.list);
    app.post('/sr', this.create);
    app.get('/sr/:id', this.get);
    app.put('/sr/:id', this.update);
    app.delete('/sr/:id', this.remove);
    app.post('/sr/notes/:id', this.createNote);
    app.delete('/sr/notes/:id/:noteId', this.removeNote);
};