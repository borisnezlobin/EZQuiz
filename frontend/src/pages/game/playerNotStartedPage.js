import { useState } from "react";
import toast from "react-hot-toast";
import "../../playground.css";
import CoolBackground from "./coolBackground";
import { v4 } from "uuid";

const PlayerNotStartedPage = ({ user, room }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    return (
        <div>
            <CoolBackground />
            <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center" style = {{position:"absolute", zIndex:"69420", textAlign: "center"}}>
                <h1 className="">{user.username}</h1>
                <p>See your name on the screen?<br />The game will get started soon!</p>

                <p className="font-bold text-left w-1/3 mt-8">While you're waiting, submit a question:</p>
                <input type="text" className="w-1/3" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
                <input type="text" className="w-1/3" placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                <button onClick={() => {
                    fetch("http://localhost:9000/submit-question", {
                        body: JSON.stringify({
                            question: {
                                id: v4(),
                                question: question,
                            },
                            answer: answer,
                            clientId: user.id,
                            roomId: room.id,
                        }),
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    });
                    toast.success("Question Submitted!");
                    setQuestion("");
                    setAnswer("");
                }}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default PlayerNotStartedPage;