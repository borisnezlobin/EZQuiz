import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RoomContext, UserContext } from "../../context.tsx";
import Leaderboard from "./leaderboard.tsx";

const getPostfix = (num) => {
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

const PlayerEndGamePage = ({ data, room, player }) => {
    const nav = useNavigate();
    const { setRoom } = useContext(RoomContext);
    const { user, setUser } = useContext(UserContext);

    data.rank = room.players.filter((p) => !p.isHost).sort((a, b) => b.score - a.score).findIndex((p) => p.id === player.id) + 1;

    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 overflow-y-scroll flex flex-col justify-center items-center">
            <h1 className="text-6xl text-left">
                {data.rank}{getPostfix(data.rank)} place{data.rank < 4}!<br />
                <span className="text-lg font-bold">{user.score} points</span>
            </h1>

            {/* <hr className="w-full max-w-4/5" /> */}

            <div className="w-full md:w-1/2 mt-8">
                <Leaderboard room={room} selectUser={player} />
            </div>

            <button className="mt-8" onClick={() => {
                setUser(null);
                setRoom(null);
                nav("/");
            }}>
                Exit Game
            </button>
        </div>
    )
}

export default PlayerEndGamePage;