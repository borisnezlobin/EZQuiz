// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index.mts');
// var usersRouter = require('./routes/users');
// var cors = require("cors");

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";
import path from "path";
import indexRouter from "./routes/index";

var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

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

export default app;
