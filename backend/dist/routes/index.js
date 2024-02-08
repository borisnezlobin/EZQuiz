"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var verify_object_1 = require("../types/verify-object");
var ws_1 = __importDefault(require("ws"));
var server_1 = __importDefault(require("../server"));
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var version_1 = require("../version");
var similarity_1 = require("./similarity");
var router = express_1.default.Router();
router.get("/", function (req, res, next) {
    // but have you ever seen something this good?
    var html = fs_1.default.readFileSync(path_1.default.join(__dirname, "./status.html"), "utf8");
    html = html.replace("{{ rooms }}", rooms.length.toString());
    var players = 0;
    for (var i = 0; i < rooms.length; i++) {
        players += rooms[i].players.length;
    }
    html = html.replace("{{ players }}", players.toString());
    html = html.replace("{{ version }}", version_1.version);
    res.status(200).send(html);
});
var randomHex = function () {
    return "".concat(Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padEnd(6, "0")).toUpperCase();
};
var rooms = [];
router.post("/room/join", function (req, res) {
    var data = req.body;
    if ((0, verify_object_1.verifyRequestBody)(data, ["clientId", "roomId", "username"]))
        return res.status(400).send({ error: "Invalid request body" });
    // data will have clientId, roomId, username
    var room = getRoomWithId(data.roomId || "weeeeeeee");
    console.log(JSON.stringify(data));
    if (!room) {
        return res.status(404).send({ error: "Room with code not found" });
    }
    console.log("room " + room.id + " found");
    if (data.clientId == room.host) {
        console.log("owner is home");
        // implement show page that the owner should see
    }
    var user = {
        id: data.clientId,
        username: data.username,
        score: 0,
        connection: null,
        isHost: room.host == data.clientId,
    };
    room.players.push(user);
    for (var i = 0; i < room.players.length; i++) {
        if (room.players[i].connection) {
            room.players[i].connection.send(JSON.stringify({
                type: "room-update",
                room: serializableRoom(room),
                user: room.players[i],
            }));
        }
    }
    // update room for host
    var host = room.host;
    if (!host)
        return res
            .status(500)
            .send({ error: "Host not found for room " + room.id });
    if (host.connection) {
        host.connection.send(JSON.stringify({
            type: "room-update",
            room: serializableRoom(room),
        }));
    }
    res.status(200).send({
        user: user,
        room: serializableRoom(room),
    });
});
var getRoomWithId = function (id) {
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id == id.toUpperCase())
            return rooms[i];
    }
    return null;
};
router.get("/room/:id", function (req, res) {
    var room = getRoomWithId(req.params.id);
    if (!room)
        return res.status(404).send({ error: "Room not found" });
    return res.send(room);
});
router.post("/submit-question", function (req, res) {
    var data = req.body;
    if ((0, verify_object_1.verifyRequestBody)(data, ["clientId", "roomId", "question", "answer"]))
        return res.status(400).send({ error: "Invalid request body" });
    var room = getRoomWithId(data.roomId);
    if (!room)
        return res.status(404).send({ error: "Room not found" });
    var host = room.host;
    if (!host)
        return res
            .status(404)
            .send({ error: "Host for room " + room.id + " not found" });
    var player = getPlayerWithId(room.id, data.clientId);
    if (!player)
        return res.status(404).send({ error: "Player not found" });
    var question = {
        question: data.question,
        answer: data.answer,
        submittedBy: player,
        id: randomHex(),
        options: [],
        answers: [],
        used: false,
    };
    room.questions.push(question);
    if (host.connection) {
        host.connection.send(JSON.stringify({
            type: "room-update",
            room: serializableRoom(room),
        }));
    }
    res.status(200).send({ success: true });
});
var findQuestionWithId = function (room, questionId) {
    console.log("finding question with id " + questionId);
    if (!room)
        return null;
    console.log("room questions are " + JSON.stringify(room.questions));
    for (var i = 0; i < room.questions.length; i++) {
        if (room.questions[i].id == questionId)
            return room.questions[i];
        else
            console.log("tried to match question " +
                JSON.stringify(room.questions[i]) +
                " with " +
                questionId);
    }
    return null;
};
router.post("/next-question", function (req, res) {
    var room = getRoomWithId(req.body.roomId);
    if (!room)
        return res.status(404).send({ error: "Room not found" });
    var player = getPlayerWithId(room.id, req.body.clientId);
    if (!player)
        return res.status(404).send({ error: "Player not found" });
    var host = room.host;
    if (!host)
        return res.status(404).send({ error: "Host not found" });
    if (room.questions.length == 0)
        return;
    room.questions[room.questionNumber - 1].used = true;
    room.questionNumber += 1;
    // pop current question from questions list
    // room.questions = room.questions.filter((question) => {
    //   console.log(question);
    //   return question.id != room.questions[room.questionNumber - 1].id;
    // });
    // TODO: game ended if all questions used up
    if (room.questionNumber > room.questions.length) {
        // publish to all players that game has ended
        if (host.connection) {
            host.connection.send(JSON.stringify({
                type: "room-update",
                room: serializableRoom(room),
            }));
            host.connection.send(JSON.stringify({
                type: "game-end",
                room: serializableRoom(room),
            }));
        }
        for (var i = 0; i < room.players.length; i++) {
            var player_1 = room.players[i];
            if (player_1.connection) {
                player_1.connection.send(JSON.stringify({
                    type: "room-update",
                    room: serializableRoom(room),
                    user: serializableUser(player_1),
                }));
                player_1.connection.send(JSON.stringify({
                    type: "game-end",
                    room: serializableRoom(room),
                }));
            }
        }
        // delete room
        rooms = rooms.filter(function (r) { return r.id != room.id; });
        return res.status(200).send({ success: true });
    }
    // room.currentQuestion = room.questions[Math.floor(Math.random() * room.questions.length)];
    room.pendingAnswers = [];
    var newQuestion = room.questions[room.questionNumber - 1];
    if (host.connection) {
        host.connection.send(JSON.stringify({
            type: "room-update",
            room: serializableRoom(room),
        }));
        host.connection.send(JSON.stringify({
            type: "show-question",
            question: newQuestion.question,
            username: newQuestion.submittedBy.username,
        }));
    }
    for (var i = 0; i < room.players.length; i++) {
        var player_2 = room.players[i];
        if (player_2.connection) {
            console.log("sending update to " + player_2.username);
            player_2.connection.send(JSON.stringify({
                type: "room-update",
                room: serializableRoom(room),
                user: serializableUser(player_2),
            }));
            player_2.connection.send(JSON.stringify({
                type: "show-question",
                question: newQuestion.question,
                username: newQuestion.submittedBy.username,
            }));
        }
    }
    res.status(200).send({ success: true });
});
function serializableUser(user) {
    return __assign(__assign({}, user), { connection: undefined });
}
function serializableRoom(room) {
    // thanks copilot
    return __assign(__assign({}, room), { host: __assign({}, serializableUser(room.host)), players: room.players.map(function (player) { return (__assign({}, serializableUser(player))); }), questions: room.questions.map(function (question) { return (__assign(__assign({}, question), { submittedBy: __assign({}, serializableUser(question.submittedBy)), answers: question.answers.map(function (answer) { return (__assign(__assign({}, answer), { player: __assign({}, serializableUser(answer.player)) })); }) })); }), pendingAnswers: room.pendingAnswers.map(function (answer) { return (__assign(__assign({}, answer), { player: __assign({}, serializableUser(answer.player)) })); }) });
}
router.post("/submit-answer", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, room, player, question, answer, host;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = req.body;
                room = getRoomWithId(data.roomId);
                if (!room)
                    return [2 /*return*/, res.status(404).send({ error: "Room not found" })];
                player = getPlayerWithId(room.id, data.clientId);
                if (!player)
                    return [2 /*return*/, res.status(404).send({ error: "Player not found" })];
                question = findQuestionWithId(room, data.id);
                if (!question)
                    return [2 /*return*/, res.status(404).send({ error: "Question not found" })];
                console.log("found question " + JSON.stringify(question));
                _a = {
                    // id: question.id,
                    answer: data.answer,
                    player: player,
                    username: player.username
                };
                return [4 /*yield*/, (0, similarity_1.getSimilarities)(question.answer, data.answer)];
            case 1:
                answer = (_a.score = _b.sent(),
                    _a);
                room.pendingAnswers.push(answer);
                console.log("pushed answer " + JSON.stringify(answer) + " to room " + room.id);
                host = room.host;
                if (!host)
                    return [2 /*return*/, res.status(404).send({ error: "Host not found" })];
                if (host.connection) {
                    host.connection.send(JSON.stringify({
                        type: "room-update",
                        room: serializableRoom(room),
                    }));
                }
                res.status(200).send({ success: true });
                return [2 /*return*/];
        }
    });
}); });
router.post("/show-results", function (req, res) {
    var room = getRoomWithId(req.body.roomId);
    if (!room)
        return res.status(404).send({ error: "Room not found" });
    var player = getPlayerWithId(room.id, req.body.clientId);
    if (!player)
        return res.status(404).send({ error: "Player not found" });
    var host = room.host;
    if (!host)
        return res.status(404).send({ error: "Host not found" });
    var scored = {};
    for (var i = 0; i < room.pendingAnswers.length; i++) {
        var answer = room.pendingAnswers[i];
        var player_3 = getPlayerWithId(room.id, answer.player.id);
        if (!player_3)
            continue;
        player_3.score += answer.score;
        scored[player_3.id] = answer.score;
    }
    for (var i = 0; i < room.players.length; i++) {
        if (player.connection) {
            console.log("sending update to " + player.username);
            player.connection.send(JSON.stringify({
                type: "room-update",
                room: serializableRoom(room),
                user: serializableUser(player),
            }));
            player.connection.send(JSON.stringify({
                type: "show-results",
                pointsReceived: scored[player.id],
                totalPoints: player.score,
            }));
        }
    }
    // update room for host
    if (host.connection) {
        host.connection.send(JSON.stringify({
            type: "room-update",
            room: serializableRoom(room),
        }));
        host.connection.send(JSON.stringify({
            type: "show-results",
            room: serializableRoom(room),
        }));
    }
    res.status(200).send({ success: true });
});
router.post("/start-game", function (req, res) {
    var data = req.body;
    var room = getRoomWithId(data.roomId);
    if (!room)
        return res.status(404).send({ error: "Room not found" });
    console.log("starting game in room " + room.id);
    var host = room.host;
    if (!host)
        return res.status(404).send({ error: "Host not found" });
    // to start the game we need to:
    // just pick a random question
    // set it to the current one
    // remove from the questions list
    // do the flow?
    var question = room.questions[Math.floor(Math.random() * room.questions.length)];
    // room.currentQuestion = question;
    room.questionNumber = 1;
    room.pendingAnswers = [];
    console.log("Got first question! Best of luck to everyone in this game!");
    if (host.connection) {
        host.connection.send(JSON.stringify({
            type: "room-update",
            room: serializableRoom(room),
        }));
        host.connection.send(JSON.stringify({
            type: "show-question",
        }));
    }
    for (var i = 0; i < room.players.length; i++) {
        var player = room.players[i];
        if (player.connection) {
            player.connection.send(JSON.stringify({
                type: "room-update",
                room: serializableRoom(room),
                user: serializableUser(player),
            }));
            player.connection.send(JSON.stringify({
                type: "show-question",
            }));
        }
    }
});
router.post("/create-room", function (req, res) {
    if ((0, verify_object_1.verifyRequestBody)(req.body, ["ownerId"]))
        return res.status(400).send({ error: "Invalid request body" });
    var goAhead = false;
    //creates a room code
    while (!goAhead) {
        var newRoomId = randomHex();
        goAhead = true;
        for (var i = 0; i < rooms.length; i++) {
            if (newRoomId == rooms[i].id) {
                goAhead = false;
                break;
            }
        }
        var player = {
            id: req.body.ownerId,
            username: "host",
            score: 0,
            isHost: true,
            connection: null,
        };
        var room = {
            id: newRoomId,
            players: [],
            questions: [],
            questionNumber: 0,
            pendingAnswers: [],
            host: player,
            createdAt: Date.now(),
        };
        if (goAhead)
            rooms.push(room);
        console.log("created room " + newRoomId);
        room.players.push(player);
        res.status(200).send({
            player: player,
            room: serializableRoom(room),
        });
    }
});
var getPlayerWithId = function (roomId, playerId) {
    var room = getRoomWithId(roomId);
    if (!room)
        return null;
    for (var i = 0; i < room.players.length; i++) {
        if (room.players[i].id == playerId)
            return room.players[i];
    }
    return null;
};
var wss = new ws_1.default.Server({
    server: server_1.default,
    perMessageDeflate: false,
    path: "/ws",
});
wss.on("listening", function () {
    console.log("websocket listening");
});
wss.on("error", function (err) {
    console.log("websocket ERROR!");
    console.error(err);
});
wss.on("connection", function (socket) {
    var clientId = "";
    var roomId = "";
    console.log("new connection!");
    socket.on("message", function (message) {
        console.log("got message " + message);
        var data = JSON.parse(message.toString());
        roomId = data.roomId;
        var room = getRoomWithId(roomId);
        if (!room)
            return;
        clientId = data.clientId;
        var player = null;
        if (room.host.id == clientId) {
            player = room.host;
        }
        else {
            player = getPlayerWithId(roomId, clientId);
            if (!player) {
                console.log("player not found");
                return;
            }
        }
        console.log(serializableRoom(room));
        console.log(roomId + " " + clientId);
        if (!player)
            return;
        if (player.connection == null) {
            player.connection = socket;
            console.log("assigned connection to player " + clientId + " in room " + roomId);
        }
        console.log("processing message based on type...");
        if (data.type == "submit-answer") {
            // do something
        }
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map