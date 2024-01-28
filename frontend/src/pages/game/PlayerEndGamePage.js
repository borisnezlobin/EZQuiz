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
    const { setUser } = useContext(UserContext);

    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            <h1 className="text-4xl">{data.points}</h1>
            <p className="mt-4">You got {data.rank}{getPostfix(data.rank)} place{data.rank < 3 ? "!" : "."}</p>
            <p className="text-sm">{data.rank > 5 ? "Better next time?" : "You showed 'em."}</p>


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