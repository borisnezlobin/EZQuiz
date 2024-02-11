import { useContext, useState } from "react";
import { RoomContext, UserContext } from "../../context.tsx";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameState from "./states";
import HostNotStartedPage from "./HostNotStarted.tsx";
import HostQuestionAnswer from "./HostQuestionAnswer.tsx";
import HostShowResults from "./HostShowResults.tsx";
import HostEndGame from "./HostEndGame.tsx";
import CONFIG from "../../config";

const HostDash = ({ client }) => {
  const { user } = useContext(UserContext);
  const [currentState, setCurrentState] = useState(GameState.NOT_STARTED);
  const [stateData, setStateData] = useState(null);
  const nav = useNavigate();
  const { room, setRoom } = useContext(RoomContext);
  console.log("host is ", user);
  const numPlayers = room.players.length - 1;

  useEffect(() => {
    if (user == null) {
      nav("/join");
    }
    var client = new W3CWebSocket(CONFIG.SOCKET_URL);

    client.onerror = (e) => {
      console.log("Connection Error!");
      console.log(e);
    };

    client.onopen = () => {
      console.log("connected!");
      client.send(
        JSON.stringify({
          type: "join-room",
          room: room.id,
          username: user.username,
          clientId: user.id,
          roomId: room.id,
        }),
      );
    };

    client.onmessage = (msg) => {
      console.log("got a message! " + msg);
      const data = JSON.parse(msg.data as string); // I guess that works
      if (data.type == "room-update") {
        setRoom(data.room);
        console.log("updated room!");
      }

      if (data.type == "start-game") {
        // maybe unnecessary
      }
      if (data.type == "show-question") {
        console.log("showing question!");
        setCurrentState(GameState.SHOW_QUESTION);
        setStateData(data);
        // question, username
        // show question (3 seconds of just question, then appear the answer box)
        // host: show question
      }
      if (data.type == "show-results") {
        setCurrentState(GameState.SHOW_RESULTS);
        setStateData(data);
        // points given, rank
        // host: show top 5
      }
      if (data.type == "game-end") {
        console.log("game ended!");
        setCurrentState(GameState.GAME_END);
        setStateData(data);
        // rank, points total
        // host: show top 3
      }
    };
  }, []);

  if (currentState == GameState.NOT_STARTED) {
    return <HostNotStartedPage user={user} room={room} />;
  }

  if (currentState == GameState.SHOW_QUESTION) {
    return <HostQuestionAnswer player={user} room={room} />;
  }

  if (currentState == GameState.SHOW_RESULTS) {
    return <HostShowResults player={user} room={room} />;
  }

  if (currentState == GameState.GAME_END) {
    return <HostEndGame room={room} />;
  }
};

export default HostDash;
