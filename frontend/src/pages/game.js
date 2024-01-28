import { useContext, useEffect, useState } from "react"
import { RoomContext, UserContext } from "../context";
import HostDash from "./game/hostDash";
import { useNavigate } from "react-router-dom";
import PlayerDash from "./game/playerDash";

const GamePage = () => {
    const { user } = useContext(UserContext);
    const nav = useNavigate();
    const { room, setRoom } = useContext(RoomContext);
    
    if(user == null){
        return (<></>);
    }

    if(user.isHost){
        return <HostDash client={null} />
    }

    return <PlayerDash client={null} />
};

export default GamePage;