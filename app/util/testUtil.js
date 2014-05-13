"use strict";
var request = require('supertest');
var goalModel  =  require('../models/goal.js').getModel();
var should     = require('should');
var accountModel = require('../models/account.js').getModel();
var testConfig  = require('./testConfig');
var assert     = require('assert');

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

exports.cleanData = function () {
    this.removeAllGoals();
    this.removeAllAccounts();
};

exports.assertGoalObj = function (expected, actual) {
    if (actual.__v !== undefined && actual.__v !== null) {
        actual.__v.should.equal(0);
    }
    actual._id.should.equal(expected._id + '');
    actual.title.should.equal(expected.title);
    actual.description.should.equal(expected.description);
    actual.type.should.equal(expected.type);
    actual.status.should.equal(expected.status);
    new Date(actual.createDate).should.eql(expected.createDate);
    new Date(actual.dueDate).should.eql(expected.dueDate);
};

exports.assertAccountObj = function (expected, actual) {
    if (actual.__v !== undefined && actual.__v !== null) {
        actual.__v.should.equal(0);
    }
    actual._id.should.equal(expected._id + '');
    actual.username.should.equal(expected.username);
    actual.email.should.equal(expected.email);
    actual.nickname.should.equal(expected.nickname);
};

exports.assertDefined = function (obj) {
    obj.should.not.equal(undefined);
    obj.should.not.equal(null);
};

exports.decorateSession = function (userAgent, callback, loginUser) {
    var self = this;
    var user = typeof loginUser !== 'undefined' ? loginUser : testConfig.dummyUser;

    userAgent.post(testConfig.url + '/api/login')
        .set('Accept', 'application/json')
        .send({
            username: user.username,
            password: user.password
        })
        .end(function (err, res) {
            self.assertDefined(res);
            self.assertDefined(res.body);
            self.assertDefined(res.body.user);
            assert.equal(res.body.user.username, user.username);
            callback(err, res);
        });
};

exports.assertNormalStatus = function (err, res) {
    should.not.exist(err);
    assert.equal(res.statusCode, 200, "statusCode is not 200 but " + res.statusCode);
};
