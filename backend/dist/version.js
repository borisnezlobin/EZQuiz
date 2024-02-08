"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrWriteVersion = exports.version = void 0;
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var versionPath = path_1.default.join(__dirname, "version.txt");
function getOrWriteVersion() {
    var data;
    try {
        data = (0, fs_1.readFileSync)(versionPath, "utf8");
    }
    catch (err) {
        console.log("Error reading file version.txt");
        console.error(err);
        if (err.code === "ENOENT") {
            (0, fs_1.writeFileSync)(versionPath, "1.0.0");
            console.error("Creating version.txt with version 1.0.0");
        }
        data = "1.0.0";
    }
    return data;
}
exports.getOrWriteVersion = getOrWriteVersion;
var verifyVersion = function (version) {
    if (!version.match(/\d+\.\d+\.\d+/)) {
        throw new Error("Invalid version: ".concat(version));
    }
};
var data = getOrWriteVersion();
verifyVersion(data);
var major = parseInt(data.split(".")[0]);
var minor = parseInt(data.split(".")[1]);
var patch = parseInt(data.split(".")[2]);
// writeFileSync("version.txt", `${major}.${minor}.${patch + 1}`);
// console.log(`Updated version to ${major}.${minor}.${patch + 1}!`);
exports.version = "".concat(major, ".").concat(minor, ".").concat(patch);
//# sourceMappingURL=version.js.map