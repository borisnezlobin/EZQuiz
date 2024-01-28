import { useContext, useEffect, useState } from "react"

import { useNavigate } from "react-router-dom";
import { RoomContext, UserContext } from "../../context";

const PlayerDash = ({ client }) => {
    const { user } = useContext(UserContext);
    const { room, setRoom } = useContext(RoomContext);
    const nav = useNavigate();
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    useEffect(() => {
        if(user == null){
            nav("/join");
        }
    }, []);

    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            <h1 className="">{user.username}</h1>
            <p>See your name on the screen? The game will get started soon!</p>

            <p>While you're waiting, submit a question:</p>
            <input type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
            <input type="text" placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <button onClick={() => {
                fetch("http://localhost:9000/submit-question", {
                    body: JSON.stringify({
                        question: question,
                        answer: answer,
                        clientId: user.id,
                    }),
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });
            }}>
                Submit
            </button>
        </div>
    )
};

export default PlayerDash;