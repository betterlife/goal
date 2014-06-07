exports.clone = function (obj) {
    "use strict";
    var copy = null;
    if (undefined === obj || null === obj || "object" !== typeof obj) {
        return obj;
    } else {
        if (!(obj instanceof Date) &&
            !(obj instanceof Array) &&
            !(obj instanceof Object)) {
            throw new Error("Unable to copy obj! Its type isn't supported.");
        }
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
        } else if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
        } else if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = this.clone(obj[attr]);
                }
            }
        }
        return copy;
    }
};

exports.ef = function () {
    "use strict";
};