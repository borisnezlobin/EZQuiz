import { Player, Room } from "../../types/game";
import PlayerStats from "./PlayerStats.tsx";

const getPostfix = (num: number) => {
    if (num === 1) {
        return "st";
    }
    if (num === 2) {
        return "nd";
    }
    if (num === 3) {
        return "rd";
    }
    return "th";
}

const PlayerResultsPage = ({ data, room, player }: { data: any, room: Room, player: Player }) => {
    // get rank in room
    data.rank = room.players.filter((p) => !p.isHost).sort((a, b) => b.score - a.score).findIndex((p) => p.id === player.id) + 1;

    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            <h1 className="text-6xl text-left">
                {data.totalPoints} points<br />
                <span className="text-lg text-green-800 font-bold">+ {data.pointsReceived}</span>
            </h1>
            <p className="text-2xl">You're in <span className="text-2xl code font-bold">{data.rank}{getPostfix(data.rank)}</span> place{data.rank < 3 ? "!" : ". Keep going!"}</p>
            <PlayerStats />

        </div>
    )
}

export default PlayerResultsPage;