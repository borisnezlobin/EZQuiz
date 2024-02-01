import { ArrowLeft, Copy, Play } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CONFIG from "../../config";

const HostNotStartedPage = ({ user, room }) => {
    const nav = useNavigate();
    console.log("host is ", user);

    const numPlayers = room.players.length - 1;

    return (
        <>
            <div className="w-full h-full p-4 min-w-screen min-h-screen z-10 gap-4 flex flex-col justify-center items-center">
                {/* <CoolBackground /> */}
                <p className="code w-full md:w-1/3">ROOM</p>
                <div className="flex flex-row gap-4 w-full md:w-1/3 justify-between items-center">
                    <h1 className="">{room.id}</h1>
                    <p className="code">{room.questions.length} Question{room.questions.length == 1 ? "" : "s"} Submitted</p>
                </div>
                <button className="w-full md:w-1/3 mb-8 text-center pill shadow-none relative group" onClick={() => {
                    window.navigator.clipboard.writeText(window.location.protocol + "//" + window.location.host + "/join/" + room.id);
                    toast.success("Copied to clipboard!");
                }}>
                    <span className="block group-hover:hidden">{window.location.protocol}//{window.location.host}/join/{room.id}</span>
                    <span className="hidden group-hover:block">Click to copy</span>
                </button>
                {numPlayers > 0 ? <hr className="w-screen max-w-4/5" /> : <></>}
                <p className="flex w-full flex-wrap items-center justify-center px-16 mt-4 gap-8">
                    {room.players.map((player) => {
                        if(player.isHost) return;
                        return <span className="border border-gray-500 rounded-lg px-4 py-2">{player.username}</span>
                    })}
                </p>
            </div>
            <div className="absolute bottom-4 w-full z-20 flex flex-row justify-center items-center gap-4">
                <p>{numPlayers} Player{numPlayers == 1 ? "" : "s"}</p>
                <button onClick={() => {
                    fetch(CONFIG.SERVER_URL + "/start-game", {
                        body: JSON.stringify({
                            roomId: room.id,
                        }),
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                }}>
                    Start Game
                    <Play />
                </button>
            </div>

            <div className="absolute top-4 left-4 w-full z-20 flex flex-row justify-start items-center gap-4">
                <button className="secondary-button" onClick={() => {
                    nav("/");
                    // TODO: server cleanup
                }}>
                    <ArrowLeft />
                    End Game
                </button>
            </div>
        </>
    );
}

export default HostNotStartedPage;