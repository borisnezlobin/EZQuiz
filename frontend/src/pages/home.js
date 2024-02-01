import { CircleNotch, Plus } from "@phosphor-icons/react"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import { RoomContext, UserContext } from "../context.tsx";
import toast from "react-hot-toast";
import { v4 } from "uuid";
import CoolBackground from "./game/coolBackground";
import "../App.css"
import logo from './images/image.png'; // with import
import CONFIG from "../config";


const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);
    const { setRoom } = useContext(RoomContext);
    const nav = useNavigate();

    return (
        <>
            <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center ban">
                <div className="justify-center items-center ezquiz">
                    {/* <h1 id="text" className="text-lg">EZQuiz</h1> */}
                    <img src={logo} className="w-screen h-screen object-contain"/>
                </div>
            </div>
            <div className="w-full h-full z-10 relative min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center main">
                <CoolBackground />
                <h1 id="text" className="text-4xl">EZQuiz</h1>
                <p className="text-center">Create a game, play with your friends, and answer questions...<br />there are no answer options to save you now!</p>
                <div className="flex flex-row justify-center items-center gap-2">
                    <button disabled={loading} onClick={() => nav("/join")}>
                        Join Game
                    </button>

                    <button disabled={loading} onClick={() => {
                        setLoading(true);
                        var responded = false;
                        fetch(CONFIG.SERVER_URL + "/create-room", {
                            body: JSON.stringify({
                                ownerId: v4(),
                            }),
                            method: "POST",
                            headers: { "Content-Type": "application/json" }
                        })
                        .then(res => res.json())
                        .then(res => {
                            responded = true;
                            if(res.error){
                                toast.error("Failed to create room :(");
                                setLoading(false);
                                return;
                            }
                            
                            setUser(res.player);
                            setRoom(res.room);
                            nav("/game");
                        });
                        setTimeout(() => {
                            if(!responded){
                                toast.error("This might take a while");
                            }
                        }, 5000);
                    }}>
                        Create Game
                        {loading ? <CircleNotch className="animate-spin" /> : <Plus />}
                    </button>
                </div>
            </div>
        </>
    )
}

export default HomePage;