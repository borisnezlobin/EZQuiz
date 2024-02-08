"use strict";
// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// var indexRouter = require('./routes/index.mts');
// var usersRouter = require('./routes/users');
// var cors = require("cors");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var path_1 = __importDefault(require("path"));
var index_1 = __importDefault(require("./routes/index"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/", index_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).send({ error: "404 not found" });
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.send({ error: "500 internal server error" });
});
exports.default = app;
//# sourceMappingURL=app.js.map