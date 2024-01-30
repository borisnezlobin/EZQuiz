const createServer = require("https").createServer;
const WebSocketServer = require("ws").WebSocketServer;
var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");
const getSimilarities = require("./similarity").getSimilarities;
// https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/
/* GET home page. */
router.get('/', function(req, res, next) {
  // read ./status.html
  var html = fs.readFileSync(path.join(__dirname, "./status.html"), "utf8");
  html = html.replace('{{ rooms }}', rooms.length);
  var players = 0;
  for(var i = 0; i < rooms.length; i++){
    players += rooms[i].players.length;
  }
  html = html.replace('{{ players }}', players);
  res.status(200).send(html);
});

function onSocketError(err) {
  console.error(err);
}


const randomHex = () => `${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")}`.toUpperCase();
var rooms = [];

router.post("/room/join", (req, res) => {
  const data = req.body;
  // data will have clientId, roomId, username
  const room = getRoomWithId(data.roomId || "weeeeeeee");
  console.log(JSON.stringify(data));
  if(!room){
    res.status(404).send({ error: "Room with code not found" });
  }
  console.log("room " + room.id + " found");
  if (data.clientId == room.host){
    console.log("owner is home");
    // implement show page that the owner should see
  }

  const user = {
    id: data.clientId,
    username: data.username,
    score: 0,
    connection: null,
    isHost: room.host == data.clientId,
  }

  
  room.players.push(user);

  // update room for host
  const host = getPlayerWithId(room.id, room.host);
  if(host.connection){
    host.connection.send(JSON.stringify({
      type: "room-update",
      room: serializableRoom(room),
    }));
  }

  res.status(200).send({
    user: user,
    room: { id: room.id }
  });
});

const getRoomWithId = (id) => {
  for(var i = 0; i < rooms.length; i++){
    if(rooms[i].id == id.toUpperCase()) return rooms[i];
  }

  return null;
};

router.get('/room/:id', (req, res) => {
  const room = getRoomWithId(req.params.id);
  if(!room) return res.status(404).send({ error: "Room not found" });
  return res.send(room);
})

router.post("/submit-question", (req, res) => {
  const data = req.body;
  const room = getRoomWithId(data.roomId);
  const host = getPlayerWithId(room.id, room.host);
  if(!room) return res.status(404).send({ error: "Room not found" });
  const player = getPlayerWithId(room.id, data.clientId);
  if(!player) return res.status(404).send({ error: "Player not found" });
  const question = {
    question: data.question,
    answer: data.answer,
    submittedBy: player.username,
    questionId: data.questionId,
    id: randomHex(),
  }
  room.questions.push(question);
  if(host.connection){
    host.connection.send(JSON.stringify({
      type: "room-update",
      room: serializableRoom(room),
    }));
  }
  res.status(200).send({ success: true });
});

const findQuestionWithId = (room, questionId) => {
  console.log("finding question with id " + questionId);
  if(!room) return null;
  console.log("room questions are " + JSON.stringify(room.questions));
  for(var i = 0; i < room.questions.length; i++){
    if(room.questions[i].question.id == questionId) return room.questions[i];
    else console.log("tried to match question " + JSON.stringify(room.questions[i]) + " with " + questionId);
  }
  return null;
}

router.post("/next-question", (req, res) => {
  const room = getRoomWithId(req.body.roomId);
  if(!room) return res.status(404).send({ error: "Room not found" });
  const player = getPlayerWithId(room.id, req.body.clientId);
  if(!player) return res.status(404).send({ error: "Player not found" });
  const host = getPlayerWithId(room.id, room.host);
  if(!host) return res.status(404).send({ error: "Host not found" });

  room.questionNumber += 1;
  // pop current question from questions list
  room.questions = room.questions.filter((question) => {
    console.log(question);
    return question.id != room.currentQuestion.id;
  });
  // TODO: game ended if all questions used up
  if(room.questions.length == 0){
    // publish to all players that game has ended
    if(host.connection){
      host.connection.send(JSON.stringify({
        type: "game-end",
        room: serializableRoom(room),
      }));
    }
    for(var i = 0; i < room.players.length; i++){
      const player = room.players[i];
      if(player.connection){
        player.connection.send(JSON.stringify({
          type: "game-end",
          room: serializableRoom(room),
        }));
      }
    }
    return res.status(200).send({ success: true });
  }

  room.currentQuestion = room.questions[Math.floor(Math.random() * room.questions.length)];
  room.questionAnswers = [];

  if(host.connection){
    host.connection.send(JSON.stringify({
      type: "room-update",
      room: serializableRoom(room),
    }));
    host.connection.send(JSON.stringify({
      type: "show-question",
      question: room.currentQuestion.question,
      username: room.currentQuestion.submittedBy,
    }));
  }

  for(var i = 0; i < room.players.length; i++){
    const player = room.players[i];
    if(player.connection){
      console.log("sending update to " + player.username);
      player.connection.send(JSON.stringify({
        type: "show-question",
        question: room.currentQuestion.question,
        username: room.currentQuestion.submittedBy,
      }));
    }
  }

  res.status(200).send({ success: true });
});

const serializableRoom = (room) => {
  return {
    id: room.id,
    players: room.players.map((player) => {
      return {
        id: player.id,
        username: player.username,
        score: player.score,
        isHost: player.isHost,
      }
    }
    ),
    questions: room.questions,
    currentQuestion: room.currentQuestion,
    questionNumber: room.questionNumber,
    questionAnswers: room.questionAnswers,
    createdAt: room.createdAt,
    host: room.host,
  };
};

router.post("/submit-answer", async (req, res) => {
  const data = req.body;
  const room = getRoomWithId(data.roomId);
  if(!room) return res.status(404).send({ error: "Room not found" });
  const player = getPlayerWithId(room.id, data.clientId);
  if(!player) return res.status(404).send({ error: "Player not found" });

  const question = findQuestionWithId(room, data.questionId);
  if(!question) return res.status(404).send({ error: "Question not found" });
  console.log("found question " + JSON.stringify(question));

  const answer = {
    questionId: question.id,
    answer: data.answer,
    submittedBy: player.id,
    scoreReceived: await getSimilarities(question.answer, data.answer),
  };

  room.questionAnswers.push(answer);
  console.log("pushed answer " + JSON.stringify(answer) + " to room " + room.id);

  const host = getPlayerWithId(room.id, room.host);
  if(host.connection){
    host.connection.send(JSON.stringify({
      type: "room-update",
      room: serializableRoom(room),
    }));
  }

  res.status(200).send({ success: true });
});

router.post("/show-results", (req, res) => {
  const room = getRoomWithId(req.body.roomId);
  if(!room) return res.status(404).send({ error: "Room not found" });
  const player = getPlayerWithId(room.id, req.body.clientId);
  if(!player) return res.status(404).send({ error: "Player not found" });
  const host = getPlayerWithId(room.id, room.host);
  if(!host) return res.status(404).send({ error: "Host not found" });

  for(var i = 0; i < room.questionAnswers.length; i++){
    const answer = room.questionAnswers[i];
    const player = getPlayerWithId(room.id, answer.submittedBy);
    if(!player) continue;
    player.score += answer.scoreReceived;
    if(player.connection){
      console.log("sending update to " + player.username);
      player.connection.send(JSON.stringify({
        type: "show-results",
        pointsReceived: answer.scoreReceived,
        totalPoints: player.score,
      }));
    }
  }

  // update room for host
  if(host.connection){
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

router.post("/start-game", (req, res) => {
  const data = req.body;
  const room = getRoomWithId(data.roomId);
  if(!room) return res.status(404).send({ error: "Room not found" });
  console.log("starting game in room " + room.id);
  const host = getPlayerWithId(room.id, room.host);
  if(!host) return res.status(404).send({ error: "Host not found" });

  // to start the game we need to:
    // just pick a random question
    // set it to the current one
    // remove from the questions list
    // do the flow?
  const question = room.questions[Math.floor(Math.random() * room.questions.length)];
  room.currentQuestion = question;
  room.questionNumber = 1;
  room.questionAnswers = [];
  console.log("first question is " + JSON.stringify(room.currentQuestion));
  if(host.connection){
    host.connection.send(JSON.stringify({
      type: "room-update",
      room: serializableRoom(room),
    }));
    host.connection.send(JSON.stringify({
      type: "show-question",
      question: question.question,
      username: question.submittedBy,
    }));
  }
  for(var i = 0; i < room.players.length; i++){
    const player = room.players[i];
    if(player.connection){
      player.connection.send(JSON.stringify({
        type: "show-question",
        question: question.question,
        username: question.submittedBy,
      }));
    }
  }
});

router.post('/create-room', (req, res) => {
  var goAhead = false;
  //creates a room code
  while (!goAhead){
    const newRoomId = randomHex();
    goAhead = true;
    for (var i = 0; i < rooms.length; i++){
      if (randomHex == rooms[i]){
        goAhead = false;
      }
    }
    const room = {
      id: newRoomId,
      players: [],
      questions: [],
      currentQuestion: null,
      questionNumber: 0,
      questionAnswers: [],
      createdAt: Date.now(),
      host: req.body.ownerId // whoever made the request? idk how we are going to identify clients or something
    }
    if (goAhead) rooms.push(room);
    console.log("created room " + newRoomId);
    const player = {
      id: req.body.ownerId,
      username: "host",
      score: 0,
      isHost: true,
      connection: null,
    }
    room.players.push(player);
    res.status(200).send({
      player: player,
      room: serializableRoom(room),
    });
  }
  // rooms[0].createServer();
});

const getPlayerWithId = (roomId, playerId) => {
  const room = getRoomWithId(roomId);
  if(!room) return null;
  for(var i = 0; i < room.players.length; i++){
    if(room.players[i].id == playerId) return room.players[i];
  }
  return null;
}

const WebSocket = require('ws');
const wss = new WebSocketServer({ port : '8000'});
wss.on("connection", socket => {
  var clientId = "";
  var roomId = "";
  socket.on("message", message => {
    console.log("got message " + message);
    const data = JSON.parse(message);
    clientId = data.clientId;
    roomId = data.roomId;
    const player = getPlayerWithId(roomId, clientId);
    const room = getRoomWithId(roomId);
    console.log(room);
    console.log(roomId + " " + clientId + " " + player);
    if(!player) return;
    if(player.connection == null){
      player.connection = socket;
      console.log("assigned connection to player " + clientId + " in room " + roomId);
    }
    console.log("processing message based on type...");
    if(data.type == "submit-answer"){
      // do something
    }
  })
});

module.exports = router;