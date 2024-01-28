import { useState } from "react";
import toast from "react-hot-toast";

const PlayerQuestionAnswer = ({ room, question, player }) => {
    const [answerText, setAnswerText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    
    const submitAnswer = () => {
        fetch("http://localhost:9000/submit-answer", {
            body: JSON.stringify({
                type: "submit-answer",
                answer: answerText,
                roomId: room.id,
                clientId: player.id,
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if(res.status == 200){
                setSubmitted(true);
            }else{
                toast.error("Error submitting answer");
            }
        });
    };
    
    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            <h1 className="text-4xl">{question}</h1>
            <div className="w-1/3 flex flex-col gap-4 justify-start items-center pb-8">
                <h1 className="text-4xl">Answer</h1>
                <textarea
                className="w-full h-32 border-2 border-black rounded-md p-4"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                />
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={submitAnswer}
            >
                Submit
            </button>
        </div>
    );
}

export default PlayerQuestionAnswer;