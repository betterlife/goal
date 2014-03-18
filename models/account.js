"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    model;

exports.getSchema = function (Schema) {
    var schema = new Schema({
        nickname: String
    });
    schema.plugin(passportLocalMongoose, {});
    return schema;
};

exports.getModel = function (persistent) {
    if (model === undefined) {
        model = persistent.model('Account', exports.getSchema(persistent.Schema));
    }
    return model;
};