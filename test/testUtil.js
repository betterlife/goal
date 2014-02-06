"use strict";
var request = require('supertest');
var goalModel = require('../models/goal.js');
var persistent = require('mongoose');
var mongodbUrl = 'mongodb://localhost/test';
//persistent.connect(mongodbUrl);
var Model = goalModel.getModel(persistent);

exports.done = function(err, res, done) {
    if (err) {
        return done(err);
    } else {
        done();
    }
};

exports.textVerify = function(text, url, path) {
    it('There should be text "' + text + '" presented in ' + url + '/' + path,
       function(done) {
           request(url).get(path).expect(function(res) {
               if (!res.text.should.containEql(text)) return "Missing " + text + " in " + url + '/' + path;
           }).end(function(err, res) {
               return done(err, res, done);
           });
       });
};

exports.removeAllGoals = function() {
    Model.find(function(err, goals) {
        if (!err) {
            for (var i = 0; i < goals.length; i++) {
                goals[i].remove();
            }
        }
    });
};

exports.assertGoalObj = function(expected, actual) {
    actual.__v.should.equal(0);
    actual._id.should.equal(expected._id + '');
    actual.title.should.equal(expected.title);
    actual.description.should.equal(expected.description);
    actual.type.should.equal(expected.type);
    actual.status.should.equal(expected.status);
    new Date(actual.createDate).should.eql(expected.createDate);
};

exports.assertDefined = function(obj) {
    obj.should.not.equal(undefined);
    obj.should.not.equal(null);
};
