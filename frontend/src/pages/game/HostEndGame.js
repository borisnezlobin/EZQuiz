import { useNavigate } from "react-router-dom";

import { ArrowRight } from "@phosphor-icons/react";

const HostEndGame = ({ room }) => {
    const nav = useNavigate();
    var players = room.players.filter((player) => !player.isHost);
    players.sort((a, b) => {
        return b.score - a.score;
    });

    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center gap-4">
                <div className="flex flex-col justify-center items-center gap-4">
                    {/* 2nd place */}
                    <div className="flex flex-col justify-center items-center gap-4 pt-8">
                        <h1 className="text-6xl">2nd</h1>
                        <h1 className="text-3xl">{players[1].username}</h1>
                        <p>{players[1].score}</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-4">
                    {/* 1st place */}
                    <div className="flex flex-row justify-center items-center gap-4">
                        <h1 className="text-6xl">1st</h1>
                        <h1 className="text-6xl">{players[0].username}</h1>
                        <p>{players[0].score}</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-4">
                    {/* 3rd place */}
                    {players.length > 2 ? 
                        <div className="flex flex-row justify-center items-center gap-4 pt-16">
                            <h1 className="text-6xl">3rd</h1>
                            <h1 className="text-6xl">{players[2].username}</h1>
                            <p>{players[2].score}</p>
                        </div>
                    : <></>}
                </div>
            </div>
            <div className="absolute bottom-4 flex flex-row justify-center items-center">
                <button onClick={() => nav("/")}>
                    Exit Game <ArrowRight />
                </button>
            </div>
        </div>
    )
};

export default HostEndGame;