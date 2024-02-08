"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRequestBody = exports.verifyObject = void 0;
var verifyObject = function (obj, keys) {
    if (!obj) {
        return false;
    }
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (!obj[key]) {
            return false;
        }
    }
    return true;
};
exports.verifyObject = verifyObject;
var verifyRequestBody = function (obj, keys) {
    if (!verifyObject(obj, keys)) {
        return 'Invalid request body';
    }
    return null;
};
exports.verifyRequestBody = verifyRequestBody;
//# sourceMappingURL=verify-object.js.map