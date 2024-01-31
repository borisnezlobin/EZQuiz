import { useState } from "react";
import toast from "react-hot-toast";
import PlayerStats from "./PlayerStats";
import CONFIG from "../../config";

const PlayerQuestionAnswer = ({ room, data, player }) => {
    const [answerText, setAnswerText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    
    const submitAnswer = () => {
        fetch(CONFIG.SERVER_URL + "/submit-answer", {
            body: JSON.stringify({
                type: "submit-answer",
                answer: answerText,
                roomId: room.id,
                clientId: player.id,
                id: data.questionId,
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
            <h1 className="text-4xl">{data.question.question}</h1>
            {!submitted ? (
                <>
                    <div className="w-2/3 lg:w-1/3 flex flex-col gap-4 justify-start items-center pb-8">
                        <p>Answer {data.username}'s question</p>
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
                </>
            ) : (
                <>
                    <p>Answer submitted!</p>
                    <p>You answered: <i className="text-base text-gray-600">"{answerText}"</i></p>
                </>
            )}
        </div>
    );
}

export default PlayerQuestionAnswer;