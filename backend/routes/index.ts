import { Player, PlayerAnswer, Question, Room } from "../types/types";
import { verifyRequestBody } from "../types/verify-object";
import WebSocket from "ws";
import server from "../server";
import express from "express";
import fs from "fs";
import path from "path";
import { version } from "../version";
import { getSimilarities } from "./similarity";
var router = express.Router();

router.get("/", function (req, res, next) {
  // but have you ever seen something this good?
  var html = fs.readFileSync(path.join(__dirname, "./status.html"), "utf8");
  html = html.replace("{{ rooms }}", rooms.length.toString());
  var players = 0;
  for (var i = 0; i < rooms.length; i++) {
    players += rooms[i].players.length;
  }
  html = html.replace("{{ players }}", players.toString());
  html = html.replace("{{ version }}", version);
  console.log(
    "server is up! has " +
      rooms.length +
      " rooms and " +
      players +
      " players, on version " +
      version,
  );
  res.status(200).send(html);
});

const randomHex = () =>
  `${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, "0")}`.toUpperCase();
var rooms: import("../types/types").Room[] = [];

router.post("/room/join", (req, res) => {
  const data = req.body;
  if (verifyRequestBody(data, ["clientId", "roomId", "username"]))
    return res.status(400).send({ error: "Invalid request body" });

  // data will have clientId, roomId, username
  const room = getRoomWithId(data.roomId || "weeeeeeee");
  console.log(JSON.stringify(data));
  if (!room) {
    return res.status(404).send({ error: "Room with code not found" });
  }
  console.log("room " + room.id + " found");
  if (data.clientId == room.host) {
    console.log("owner is home");
    // implement show page that the owner should see
  }

  const user = {
    id: data.clientId,
    username: data.username,
    score: 0,
    connection: null,
    isHost: room.host == data.clientId,
  };

  room.players.push(user);

  for (var i = 0; i < room.players.length; i++) {
    if (room.players[i].connection) {
      room.players[i].connection.send(
        JSON.stringify({
          type: "room-update",
          room: serializableRoom(room),
          user: room.players[i],
        }),
      );
    }
  }

  // update room for host
  const host = room.host;
  if (!host)
    return res
      .status(500)
      .send({ error: "Host not found for room " + room.id });

  if (host.connection) {
    host.connection.send(
      JSON.stringify({
        type: "room-update",
        room: serializableRoom(room),
      }),
    );
  }

  res.status(200).send({
    user: user,
    room: serializableRoom(room),
  });
});

const getRoomWithId = (id: string): Room | null => {
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].id == id.toUpperCase()) return rooms[i];
  }

  return null;
};

router.get("/room/:id", (req, res) => {
  const room = getRoomWithId(req.params.id);
  if (!room) return res.status(404).send({ error: "Room not found" });
  return res.send(room);
});

router.post("/submit-question", (req, res) => {
  const data = req.body;
  if (verifyRequestBody(data, ["clientId", "roomId", "question", "answer"]))
    return res.status(400).send({ error: "Invalid request body" });
  const room = getRoomWithId(data.roomId);
  if (!room) return res.status(404).send({ error: "Room not found" });
  const host = room.host;
  if (!host)
    return res
      .status(404)
      .send({ error: "Host for room " + room.id + " not found" });
  const player = getPlayerWithId(room.id, data.clientId);
  if (!player) return res.status(404).send({ error: "Player not found" });
  const question: Question = {
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
    host.connection.send(
      JSON.stringify({
        type: "room-update",
        room: serializableRoom(room),
      }),
    );
  }
  res.status(200).send({ success: true });
});

const findQuestionWithId = (room: Room, questionId: string) => {
  console.log("finding question with id " + questionId);
  if (!room) return null;
  console.log(
    "room questions are " +
      JSON.stringify(room.questions.map((q) => serializableQuestion(q))),
  );
  for (var i = 0; i < room.questions.length; i++) {
    if (room.questions[i].id == questionId) return room.questions[i];
    else
      console.log(
        "tried to match question " +
          JSON.stringify(room.questions[i]) +
          " with " +
          questionId,
      );
  }
  return null;
};

router.post("/next-question", (req, res) => {
  const room = getRoomWithId(req.body.roomId);
  if (!room) return res.status(404).send({ error: "Room not found" });
  const player = getPlayerWithId(room.id, req.body.clientId);
  if (!player) return res.status(404).send({ error: "Player not found" });
  const host = room.host;
  if (!host) return res.status(404).send({ error: "Host not found" });

  if (room.questions.length == 0) return;

  room.questions[room.questionNumber - 1].used = true;
  room.questionNumber += 1;
  // pop current question from questions list
  // room.questions = room.questions.filter((question) => {
  //   console.log(question);
  //   return question.id != room.questions[room.questionNumber - 1].id;
  // });
  // TODO: game ended if all questions used up
  if (room.questionNumber > room.questions.length) {
    console.log("game " + room.id + " has ended!");
    // publish to all players that game has ended
    if (host.connection) {
      host.connection.send(
        JSON.stringify({
          type: "room-update",
          room: serializableRoom(room),
        }),
      );
      host.connection.send(
        JSON.stringify({
          type: "game-end",
          room: serializableRoom(room),
        }),
      );
    }
    for (var i = 0; i < room.players.length; i++) {
      const player = room.players[i];
      if (player.connection) {
        player.connection.send(
          JSON.stringify({
            type: "room-update",
            room: serializableRoom(room),
            user: serializableUser(player),
          }),
        );
        player.connection.send(
          JSON.stringify({
            type: "game-end",
            room: serializableRoom(room),
          }),
        );
      } else {
        console.log("no connection for " + player.username);
      }
    }

    // delete room
    rooms = rooms.filter((r) => r.id != room.id);

    return res.status(200).send({ success: true });
  }

  room.pendingAnswers = [];
  const newQuestion = room.questions[room.questionNumber - 1];

  if (host.connection) {
    host.connection.send(
      JSON.stringify({
        type: "room-update",
        room: serializableRoom(room),
      }),
    );
    host.connection.send(
      JSON.stringify({
        type: "show-question",
        question: newQuestion.question,
        username: newQuestion.submittedBy.username,
      }),
    );
  }

  for (var i = 0; i < room.players.length; i++) {
    const player = room.players[i];
    if (player.connection) {
      console.log("sending update to " + player.username);
      player.connection.send(
        JSON.stringify({
          type: "room-update",
          room: serializableRoom(room),
          user: serializableUser(player),
        }),
      );
      player.connection.send(
        JSON.stringify({
          type: "show-question",
          question: newQuestion.question,
          username: newQuestion.submittedBy.username,
        }),
      );
    } else {
      console.log("no connection for " + player.username);
    }
  }

  res.status(200).send({ success: true });
});

function serializableUser(user: Player): any {
  return {
    ...user,
    connection: undefined, // remove the connection property
  };
}

function serializableRoom(room: Room): any {
  // thanks copilot
  return {
    ...room,
    host: {
      ...serializableUser(room.host),
    },
    players: room.players.map((player) => ({
      ...serializableUser(player),
    })),
    questions: room.questions.map((question) => ({
      ...question,
      submittedBy: {
        ...serializableUser(question.submittedBy),
      },
      answers: question.answers.map((answer) => ({
        ...answer,
        player: {
          ...serializableUser(answer.player),
        },
      })),
    })),
    pendingAnswers: room.pendingAnswers.map((answer) => ({
      ...answer,
      player: {
        ...serializableUser(answer.player),
      },
    })),
  };
}

function serializableQuestion(question: Question) {
  return {
    ...question,
    submittedBy: {
      ...serializableUser(question.submittedBy),
    },
    answers: question.answers.map((answer) => ({
      ...answer,
      player: {
        ...serializableUser(answer.player),
      },
    })),
  };
}

router.post("/submit-answer", async (req, res) => {
  const data = req.body;
  const room = getRoomWithId(data.roomId);
  if (!room) return res.status(404).send({ error: "Room not found" });
  const player = getPlayerWithId(room.id, data.clientId);
  if (!player) return res.status(404).send({ error: "Player not found" });

  const question = findQuestionWithId(room, data.id);
  if (!question) return res.status(404).send({ error: "Question not found" });
  console.log(
    "found question " + JSON.stringify(serializableQuestion(question)),
  );

  const answer: PlayerAnswer = {
    // id: question.id,
    answer: data.answer,
    player: player,
    username: player.username,
    score: await getSimilarities(question.answer, data.answer),
  };

  room.pendingAnswers.push(answer);
  console.log(
    "pushed answer " + JSON.stringify(answer) + " to room " + room.id,
  );

  const host = room.host;
  if (!host) return res.status(404).send({ error: "Host not found" });
  if (host.connection) {
    host.connection.send(
      JSON.stringify({
        type: "room-update",
        room: serializableRoom(room),
      }),
    );
  }

  res.status(200).send({ success: true });
});

router.post("/show-results", (req, res) => {
  const room = getRoomWithId(req.body.roomId);
  if (!room) return res.status(404).send({ error: "Room not found" });
  const host = room.host;
  if (!host) return res.status(404).send({ error: "Host not found" });

  const scored = {};
  for (var i = 0; i < room.pendingAnswers.length; i++) {
    const answer = room.pendingAnswers[i];
    const player = getPlayerWithId(room.id, answer.player.id);
    if (!player) continue;
    player.score += answer.score;
    scored[player.id] = answer.score;
  }

  for (const player of room.players) {
    if (player.connection) {
      console.log("sending update to " + player.username);
      player.connection.send(
        JSON.stringify({
          type: "room-update",
          room: serializableRoom(room),
          user: serializableUser(player),
        }),
      );
      player.connection.send(
        JSON.stringify({
          type: "show-results",
          pointsReceived: scored[player.id],
          totalPoints: player.score,
        }),
      );
    }
  }

  // update room for host
  if (host.connection) {
    host.connection.send(
      JSON.stringify({
        type: "room-update",
        room: serializableRoom(room),
      }),
    );

    host.connection.send(
      JSON.stringify({
        type: "show-results",
        room: serializableRoom(room),
      }),
    );
  }

  res.status(200).send({ success: true });
});

router.post("/start-game", (req, res) => {
  const data = req.body;
  const room = getRoomWithId(data.roomId);
  if (!room) return res.status(404).send({ error: "Room not found" });
  console.log("starting game in room " + room.id);
  const host = room.host;
  if (!host) return res.status(404).send({ error: "Host not found" });

  // to start the game we need to:
  // just pick a random question
  // set it to the current one
  // remove from the questions list
  // do the flow?
  const question =
    room.questions[Math.floor(Math.random() * room.questions.length)];
  // room.currentQuestion = question;
  room.questionNumber = 1;
  room.pendingAnswers = [];
  console.log("Got first question! Best of luck to everyone in this game!");
  if (host.connection) {
    host.connection.send(
      JSON.stringify({
        type: "room-update",
        room: serializableRoom(room),
      }),
    );
    host.connection.send(
      JSON.stringify({
        type: "show-question",
      }),
    );
  }
  for (var i = 0; i < room.players.length; i++) {
    const player = room.players[i];
    if (player.connection) {
      player.connection.send(
        JSON.stringify({
          type: "room-update",
          room: serializableRoom(room),
          user: serializableUser(player),
        }),
      );
      player.connection.send(
        JSON.stringify({
          type: "show-question",
        }),
      );
    }
  }
});

router.post("/create-room", (req, res) => {
  if (verifyRequestBody(req.body, ["ownerId"]))
    return res.status(400).send({ error: "Invalid request body" });
  var goAhead = false;
  //creates a room code
  while (!goAhead) {
    const newRoomId = randomHex();
    goAhead = true;
    for (var i = 0; i < rooms.length; i++) {
      if (newRoomId == rooms[i].id) {
        goAhead = false;
        break;
      }
    }
    const player: Player = {
      id: req.body.ownerId,
      username: "host",
      score: 0,
      isHost: true,
      connection: null,
    };
    const room: Room = {
      id: newRoomId,
      players: [],
      questions: [],
      questionNumber: 0,
      pendingAnswers: [],
      host: player,
      createdAt: Date.now(),
    };
    if (goAhead) rooms.push(room);
    console.log("created room " + newRoomId);
    room.players.push(player);
    res.status(200).send({
      player: player,
      room: serializableRoom(room),
    });
  }
});

const getPlayerWithId = (roomId, playerId) => {
  const room = getRoomWithId(roomId);
  if (!room) return null;
  for (var i = 0; i < room.players.length; i++) {
    if (room.players[i].id == playerId) return room.players[i];
  }
  return null;
};

let wss = new WebSocket.Server({
  server,
  perMessageDeflate: false,
  path: "/ws",
});

wss.on("listening", () => {
  console.log("websocket listening");
});

wss.on("error", (err) => {
  console.log("websocket ERROR!");
  console.error(err);
});

wss.on("connection", (socket) => {
  var clientId = "";
  var roomId = "";
  console.log("new connection!");
  socket.on("message", (message) => {
    console.log("got message " + message);
    const data = JSON.parse(message.toString());
    roomId = data.roomId;
    const room = getRoomWithId(roomId);
    if (!room) return;
    clientId = data.clientId;
    let player: Player | null = null;
    if (room.host.id == clientId) {
      player = room.host;
    } else {
      player = getPlayerWithId(roomId, clientId);
      if (!player) {
        console.log("player not found");
        return;
      }
    }
    console.log(serializableRoom(room));
    console.log(roomId + " " + clientId);
    if (!player) return;
    if (player.connection == null) {
      player.connection = socket;
      console.log(
        "assigned connection to player " + clientId + " in room " + roomId,
      );
    }
    console.log("processing message based on type...");
    if (data.type == "submit-answer") {
      // do something
    }
  });
});

export default router;
