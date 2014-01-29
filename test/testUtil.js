"use strict";
var request = require('supertest');

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
