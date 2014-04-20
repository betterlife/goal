"use strict";
var request = require('supertest');
var goalModel  =  require('../models/goal.js').getModel();
var accountModel = require('../models/account.js').getModel();
var mongodbUrl = 'mongodb://localhost/test';
var removeAllObj = function (objModel) {
    objModel.find(function (err, objs) {
        if (!err && objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                objs[i].remove();
            }
        }
    });
};

exports.done = function (err, res, done) {
    if (err) {
        return done(err);
    }
    done();
};

exports.textVerify = function (text, url, path) {
    it('There should be text "' + text + '" presented in ' + url + '/' + path,
        function (done) {
            request(url).get(path).expect(function (res) {
                if (!res.text.should.containEql(text)) {
                    return "Missing " + text + " in " + url + '/' + path;
                }
            }).end(function (err, res) {
                return done(err, res, done);
            });
        });
};

exports.removeAllGoals = function () {
    removeAllObj(goalModel);
};

exports.removeAllAccounts = function () {
    removeAllObj(accountModel);
};

exports.assertGoalObj = function (expected, actual) {
    actual.__v.should.equal(0);
    actual._id.should.equal(expected._id + '');
    actual.title.should.equal(expected.title);
    actual.description.should.equal(expected.description);
    actual.type.should.equal(expected.type);
    actual.status.should.equal(expected.status);
    new Date(actual.createDate).should.eql(expected.createDate);
};

exports.assertAccountObj = function (expected, actual) {
    actual.__v.should.equal(0);
    actual._id.should.equal(expected._id + '');
    actual.username.should.equal(expected.username);
    actual.email.should.equal(expected.email);
    actual.nickname.should.equal(expected.nickname);
};

exports.assertDefined = function (obj) {
    obj.should.not.equal(undefined);
    obj.should.not.equal(null);
};
