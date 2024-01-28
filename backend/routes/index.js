var express = require('express');
var router = express.Router();
// https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



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
    name: data.username,
    score: 0 ,
    isHost: room.host == data.clientId,
  }
  
  room.players.push(user);
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

router.use('/create-room', (req, res) => {
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
    if (goAhead) rooms.push({
      ownerId: req.params,
      id: newRoomId,
      players: [],
      createdAt: Date.now(),
      host: null // whoever made the request? idk how we are going to identify clients or something
    });
    console.log("created room " + newRoomId);
    res.send("created room " + newRoomId);
  }
  // rooms[0].createServer();
});

module.exports = router;