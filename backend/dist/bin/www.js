#!/usr/bin/env node
"use strict";
/**
 * Module dependencies.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("../app"));
var server_1 = __importDefault(require("../server"));
var debug_1 = __importDefault(require("debug"));
/**
 * Create HTTP server.
 */
// server.on("request", app);
var port = normalizePort(process.env.PORT || "8000");
app_1.default.set("port", port);
/**
 * Listen on provided port, on all network interfaces.
 */
// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server_1.default.address();
    if (addr === null) {
        return;
    }
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    (0, debug_1.default)("Listening on " + bind);
}
var serverPort = process.env.PORT || 8000;
server_1.default.listen(serverPort, function () {
    console.log("server up? I guess? on port " + serverPort);
});
//# sourceMappingURL=www.js.map