import { useContext } from "react"
import { RoomContext, UserContext } from "../../context";
import { Play } from "@phosphor-icons/react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const HostDash = ({ client }) => {
    const { user } = useContext(UserContext);
    const nav = useNavigate();
    const { room, setRoom } = useContext(RoomContext);
    console.log("host is ", user);

    const numPlayers = room.players.length - 1;

    useEffect(() => {
        if(user == null){
            nav("/join");
        }
        var client = new W3CWebSocket('ws://127.0.0.1:8000');

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

    return (
        <>
            <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
                <div className="w-1/3 flex flex-row gap-4 justify-start items-center pb-8">
                    <h1 className="">{room.id}</h1>
                    <p>{room.questions.length} Question{room.questions.length == 1 ? "" : "s"} Submitted</p>
                </div>
                {numPlayers > 0 ? <hr className="w-2/3" /> : <></>}
                <p className="flex flex-wrap px-16 mt-4 gap-4">
                    {room.players.map((player) => {
                        if(player.isHost) return;
                        return <span>{player.username}</span>
                    })}
                </p>
            </div>
            <div className="absolute bottom-4 w-full flex flex-row justify-center items-center gap-4">
                <p>{numPlayers} Player{numPlayers == 1 ? "" : "s"}</p>
                <button>
                    Start Game
                    <Play />
                </button>
            </div>
        </>
    );
}

export default HostDash;