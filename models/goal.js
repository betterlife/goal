//Goal Model
"use strict";
exports.getSchema = function (Schema) {
    return new Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        type: {
            type: String,
            required: true
        },
        createDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String
        },
        comments: [
            {
                date: {
                    type: Date,
                    default: Date.now
                },
                content: {
                    type: String
                }
            }
        ]
    });
};

exports.getModel = function (persistent) {
    return persistent.model('Goal', exports.getSchema(persistent.Schema));
};

exports.getGoalTypes = function () {
    return [ 'Long term(10 to 20 Year)', 'Middle term(3-5 Year)', 'Annually', 'Monthly', 'Weekly'];
};

exports.getStatuses = function () {
    return ['New', 'In Progress', 'Finished', 'Postponed', 'Dropped'];
};