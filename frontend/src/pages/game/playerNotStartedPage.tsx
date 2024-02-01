import { useState } from "react";
import toast from "react-hot-toast";
import "../../playground.css";
import { v4 } from "uuid";
import CONFIG from "../../config";

const PlayerNotStartedPage = ({ user, room }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [qSubmitted, setQSubmitted] = useState(0);

    return (
        <div>
            <div className="w-full h-full min-w-screen min-h-screen gap-4 p-4 flex flex-col justify-center items-center" style={{ position: "absolute", zIndex: "69420", textAlign: "center" }}>
                <h1 className="">{user.username}</h1>
                <p className="text-gray-700 text-sm">See your name on the screen?</p>

                <p className="font-bold text-left md:w-1/3 mt-8">While you're waiting, submit a question:</p>
                <input type="text" className="md:w-1/3" placeholder="Question" value={question} onChange={(e) => {
                    e.preventDefault();
                    setQuestion(e.target.value);
                }} />
                <input type="text" className="md:w-1/3" placeholder="Answer" value={answer} onChange={(e) => {
                    e.preventDefault();
                    setAnswer(e.target.value);
                }} />
                <div className="md:w-1/3 flex flex-row items-center justify-center gap-4">
                    <p>
                        <span className="code">{qSubmitted}</span> Question{qSubmitted == 1 ? "" : "s"} Submitted
                    </p>
                    <button onClick={() => {
                        if (question.trim() == "" || answer.trim() == "") {
                            toast.error("Please enter a question and answer");
                            return;
                        }
                        fetch(CONFIG.SERVER_URL + "/submit-question", {
                            body: JSON.stringify({
                                question: question,
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
                        setQSubmitted(qSubmitted + 1);
                    }}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PlayerNotStartedPage;