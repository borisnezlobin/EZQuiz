import { ArrowRight } from "@phosphor-icons/react";
import CONFIG from "../../config";
import type { Room, Player } from "../../types/game";

const HostShowResults = ({ room, player }: { room: Room, player: Player }) => {
    const currentQuestion = room.questions[room.questionNumber - 1];

    // TODO: show top 5 from room.players
    var players = room.players.filter((player) => !player.isHost);
    players.sort((a, b) => {
        return b.score - a.score;
    });

    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            <h1 className="text-6xl">Leaderboard</h1>
            <p className="text-xl absolute top-4 right-4 code pill">{room.questionNumber} / {room.questions.length}</p>
            <p>{currentQuestion.question}</p>
            <p>Answer: {currentQuestion.answer}</p>
            <hr className="w-2/3 lg:w-1/3" />
            <ol className="flex flex-col w-2/3 lg:w-1/3 justify-center items-center gap-4">
                {players.map((player, index) => {
                    return (
                        <li className="flex flex-row w-full justify-between items-center gap-4">
                            <div className={`flex flex-row justify-center items-center gap-4 ${index == 0 ? "font-bold text-yellow-700" : ""}`}>
                                <p>{index + 1}</p>
                                <p>{player.username}</p>
                            </div>
                            <span className="rounded-full border text-xs border-gray-500 px-2 py-1">{player.score}</span>
                        </li>
                    )
                })}
            </ol>
            <div className="absolute bottom-4 flex flex-row justify-center items-center">
                <button onClick={() => {
                    fetch(CONFIG.SERVER_URL + "/next-question", {
                        body: JSON.stringify({
                            // TODO:
                            roomId: room.id,
                            clientId: player.id,
                        }),
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                }}>
                    Next
                    <ArrowRight />
                </button>
            </div>
        </div>
    )
}

export default HostShowResults;