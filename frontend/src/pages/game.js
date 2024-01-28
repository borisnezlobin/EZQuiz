import { useContext, useEffect, useState } from "react"
import { RoomContext, UserContext } from "../context";
import HostDash from "./game/hostDash";
import { useNavigate } from "react-router-dom";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import PlayerDash from "./game/playerDash";

const GamePage = () => {
    const { user } = useContext(UserContext);
    const nav = useNavigate();
    const { room, setRoom } = useContext(RoomContext);
    const [client, setClient] = useState(null);

    useEffect(() => {
        if(user == null){
            nav("/join");
        }

        if(!client){
            setClient(new W3CWebSocket('ws://127.0.0.1:8000'));
            return;
        }
        console.log(client);

        client.onerror = (e) => {
            console.log("Connection Error!");
            console.log(e);
        }

        client.onopen = () => {
            console.log("connected!");
            client.send(JSON.stringify({
                type: "join-room",
                room: room.id,
                username: user.username,
                clientId: user.id,
                roomId: room.id,
            }));
        }

        client.onmessage = (msg) => {
            console.log("got a message! " + msg);
            const data = JSON.parse(msg.data);
            if(data.type == "room-update"){
                setRoom(data.room);
                console.log("updated room!");
            }
        };
    }, []);

    if(user == null){
        return (<></>);
    }

    if(user.isHost){
        return <HostDash client={client} />
    }

    return <PlayerDash client={client} />
};

export default GamePage;