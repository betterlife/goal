//Goal Model
"use strict";
var marked = require('marked'),
    mongoose = require('mongoose'),
    moment  = require('moment'),
    Schema = mongoose.Schema;
var model;

moment.lang('en', {
    calendar : {
        lastDay : '[Yesterday] ',
        sameDay : '[Today] ',
        nextDay : '[Tomorrow] ',
        lastWeek : '[Last] dddd ',
        nextWeek : '[Next] dddd ',
        sameElse : 'L'
    }
});

exports.getSchema = function (Schema) {
    var schema = new Schema({
        userId      : { type : Schema.ObjectId, ref: 'UserSchema'},
        title       : { type : String, required : true },
        description : { type : String },
        type        : { type : String, required : true },
        createDate  : { type : Date,   default  : Date.now },
        dueDate     : { type : Date},
        status      : { type : String },
        comments: [{
            date    : { type : Date, default : Date.now },
            content : { type : String }
        }]
    });
    schema.virtual('markedDescription').get(function () {
        if (this.description !== '' && this.description !== undefined && this.description !== null) {
            return marked(this.description);
        }
        return '<p>&nbsp;</p>';
    });
    schema.virtual('dueDateDisplay').get(function () {
        var date, m, prefix, diff, thisMoment;
        if (this.dueDate !== '' && this.dueDate !== undefined && this.dueDate !== null) {
            m = moment(this.dueDate);
            if (null !== m) {
                thisMoment = moment(new Date());
                diff = m.diff(thisMoment, 'days');
                if (diff > 7 || diff < -7) {
                    prefix = m.format("dddd, MMMM Do YYYY");
                } else {
                    prefix = m.calendar();
                }
                return  prefix + " (" + m.fromNow() + ")";
            }
            return " ";
        }
        return 'No Due Date';
    });
    schema.set('toJSON', { virtuals: true });
    return schema;
};

exports.getModel = function () {
    if (model === undefined) {
        model = mongoose.model('Goal', exports.getSchema(Schema));
    }
    return model;
};

exports.getGoalTypes = function () {
    return [ 'Long term(10 to 20 Year)', 'Middle term(3-5 Year)', 'Annually', 'Half-Year', 'Monthly', 'Weekly'];
};

exports.getStatuses = function () {
    return ['New', 'In Progress', 'Finished', 'Postponed', 'Dropped', 'Failed'];
};

exports.getArchivedStatuses = function () {
    return ['Finished', 'Dropped', 'Failed'];
};
