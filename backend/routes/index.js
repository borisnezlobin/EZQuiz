const createServer = require("https").createServer;
const WebSocketServer = require("ws").WebSocketServer;
var express = require('express');
var router = express.Router();
// https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function onSocketError(err) {
  console.error(err);
}


const randomHex = () => `${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")}`.toUpperCase();
var rooms = [];


class Room{
	constructor(roomN){
    	this.number = roomN;
    }
    
  	displayInfo(){
    	return this.number;
    }
}

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
      room: room,
    }));
  }

  res.status(200).send(user);
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
      room: room,
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