import { useContext, useEffect, useState } from "react"
import { RoomContext, UserContext } from "../context.tsx";
import HostDash from "./game/hostDash.tsx";
import { useNavigate } from "react-router-dom";
import PlayerDash from "./game/playerDash.tsx";

const GamePage = () => {
    const { user } = useContext(UserContext);
    const nav = useNavigate();
    const { room, setRoom } = useContext(RoomContext);

    useEffect(() => {
        if(user == null){
            nav("/join");
        }
    }, [user]);
    
    if(user == null){
        return (<></>);
    }

    if(user.isHost){
        return <HostDash client={null} />
    }

    return <PlayerDash client={null} />
};

export default GamePage;