import { useContext } from "react"
import { RoomContext, UserContext } from "../../context";
import { Play } from "@phosphor-icons/react";
import { useEffect } from 'react';


const HostDash = ({ client }) => {
    const { user } = useContext(UserContext);
    const { room, setRoom } = useContext(RoomContext);
    console.log("host is ", user);

    const numPlayers = room.players.length - 1;

    return (
        <>
            <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
                <h1 className="">{room.id}</h1>
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