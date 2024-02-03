import { Player, Room } from "../../types/game";

const Leaderboard = ({ room, selectUser }: { room: Room, selectUser: Player | null }) => {
    return (
        <div className="w-full h-full min-w-screen gap-4 flex flex-col justify-center items-center">
            <h1 className="text-2xl w-full text-left">
                Leaderboard
            </h1>
            <div className="w-full gap-2">
                <div className="flex flex-col justify-between items-center w-full max-h-1/2 overflow-y-auto">
                    {room.players.filter((p) => !p.isHost).sort((a, b) => b.score - a.score).map((player, index) => (
                        <div key={player.id} className={`${player.id == selectUser.id ?
                            "text-[#3761e2] bg-gray-100 font-bold" : index < 3 && room.players.length > 3 ?
                                "font-bold" : ""}
                            h-[3.5rem] px-4 gap-2 rounded-lg flex flex-row justify-between items-center w-full`}>
                            <p>{index + 1}.</p>
                            <p className="flex-1 text-left">{player.username}</p>
                            <p className="pill border-none w-36 text-center m-0">
                                {player.score}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;