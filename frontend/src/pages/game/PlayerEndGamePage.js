import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RoomContext, UserContext } from "../../context";

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

    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            <h1 className="text-4xl m-0">{user.score}</h1>
            <p className="text-sm text-gray-500">points</p>
            <p className="mt-4">A game well played -- see you next time.</p>


            <button onClick={() => {
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