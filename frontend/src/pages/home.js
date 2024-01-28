import { CircleNotch, Plus } from "@phosphor-icons/react"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import { RoomContext, UserContext } from "../context";
import toast from "react-hot-toast";
import { v4 } from "uuid";
import "../App.css"


const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);
    const { setRoom } = useContext(RoomContext);
    const nav = useNavigate();

    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center main">
            <h1 className="">EZQuiz</h1>
            <p className="mb-24 text-center">Create a game, play with your friends, and answer questions...<br />there are no answer options to save you now!</p>
            <div className="flex flex-row justify-center items-center gap-2">
                <button disabled={loading} onClick={() => nav("/join")}>
                    Join Game
                </button>

                <button disabled={loading} onClick={() => {
                    setLoading(true);
                    fetch("http://localhost:9000/create-room", {
                        body: JSON.stringify({
                            ownerId: v4(),
                        }),
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    })
                    .then(res => res.json())
                    .then(res => {
                        if(res.error){
                            toast.error("Failed to create room :(");
                            setLoading(false);
                            return;
                        }
                        
                        setUser(res.player);
                        setRoom(res.room);
                        nav("/game");
                    });
                }}>
                    Create Game
                    {loading ? <CircleNotch className="animate-spin" /> : <Plus />}
                </button>
            </div>
        </div>
    )
}

export default HomePage;