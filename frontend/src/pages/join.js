import { useContext, useEffect, useState } from "react";
import { ArrowRight, CircleNotch } from "@phosphor-icons/react";
import { v4 } from "uuid";
import { RoomContext, UserContext } from "../context.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import toast from "react-hot-toast";
import CONFIG from "../config";

const JoinPage = () => {
    // get the room id from the url (after /join/)
    const { id } = useParams();
    const [roomId, setRoomId] = useState(id ? id : "");
    const [username, setUsername] = useState("");
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { setUser } = useContext(UserContext);
    const { setRoom } = useContext(RoomContext);
    const nav = useNavigate();

    useEffect(() => {
        if(id){
            findRoomWithId();
        }
    })

    const joinGame = () => {
        if(username.trim().length < 2){
            setError("Username too short!");
            return;
        }
        // make request (better work tbh)
        setLoading(true);

        fetch(CONFIG.SERVER_URL + "/room/join", {
            body: JSON.stringify({
                clientId: v4(),
                roomId: roomId,
                username: username
            }),
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }).then((res) => res.json())
        .then((res) => {
            if(res.error){
                setError(res.error);
                setLoading(false);
                return;
            }
            setUser(res.user);
            setRoom(res.room);
            nav("/game");
        });
    }

    const findRoomWithId = () => {
        setLoading(true);
        fetch(CONFIG.SERVER_URL + "/room/" + roomId)
        .then(res => res.json())
        .then(res => {
            if(res == null || res.error){
                // setError("Room not found");
                toast.error("Room not found!");
                return;
            }

            setPage(1);
        });
        setLoading(false);
    }

    return (
        <div className="w-full md:w-1/3 p-4 md:left-1/3 relative h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            {page == 0 ? <>
                <h1>Join Game</h1>
                <input
                    placeholder="Game Code"
                    className="code w-full p-4 rounded-lg text-center"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                />
                <p className="text-red-800">
                    {error}
                </p>

                <div className="flex flex-row gap-4">
                    <button onClick={() => nav("/")}>
                        <ArrowLeft />
                        Back
                    </button>

                    <button onClick={findRoomWithId} disabled={loading}>
                        Next
                        {loading ? <CircleNotch className="animate-spin" /> : <ArrowRight />}
                    </button>
                </div>
            </>
            :
            <>
                <h1>What's your name?</h1>
                <input
                    placeholder="Username"
                    className="code w-full p-4 rounded-lg text-center"
                    value={username}
                    onChange={(e) => page == 1 ? setUsername(e.target.value) : null}
                />
                <p className="text-red-800">
                    {error}
                </p>
                <div className="flex flex-row gap-4">
                    <button onClick={() => setPage(0)} disabled={loading}>
                        <ArrowLeft />
                        Back
                    </button>
                    <button onClick={joinGame} disabled={loading}>
                        {loading ? <CircleNotch className="animate-spin"/> : <></>}
                        Join
                    </button>
                </div>
            </>
            }
        </div>
    )
};

export default JoinPage;