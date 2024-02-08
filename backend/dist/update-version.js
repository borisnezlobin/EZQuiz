"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var version_1 = require("./version");
var data = (0, version_1.getOrWriteVersion)();
var major = parseInt(data.split(".")[0]);
var minor = parseInt(data.split(".")[1]);
var patch = parseInt(data.split(".")[2]);
(0, fs_1.writeFileSync)(path_1.default.join(__dirname, "./version.txt"), "".concat(major, ".").concat(minor, ".").concat(patch + 1));
console.log("Updated version to ".concat(major, ".").concat(minor, ".").concat(patch + 1, "!"));
//# sourceMappingURL=update-version.js.map