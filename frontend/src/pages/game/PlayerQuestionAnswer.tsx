import { useState } from "react";
import toast from "react-hot-toast";
import PlayerStats from "./PlayerStats.tsx";
import CONFIG from "../../config";
import type { Room, Player } from "../../types/game";
import { CircleNotch } from "@phosphor-icons/react";

const PlayerQuestionAnswer = ({ room, data, player }: { room: Room, data: any, player: Player }) => {
    const [answerText, setAnswerText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const currentQuestion = room.questions[room.questionNumber - 1];

    const submitAnswer = () => {
        if (answerText === "") {
            toast.error("Answer cannot be empty");
            return;
        }
        setLoading(true);
        fetch(CONFIG.SERVER_URL + "/submit-answer", {
            body: JSON.stringify({
                type: "submit-answer",
                answer: answerText,
                roomId: room.id,
                clientId: player.id,
                id: currentQuestion.id,
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.status == 200) {
                setSubmitted(true);
            } else {
                toast.error("Error submitting answer");
            }

            setLoading(false);
        });
    };

    return (
        <>
            <div className="w-full md:w-1/3 md:left-1/3 relative h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
                <h1 className="text-4xl w-full text-center">{currentQuestion.question}</h1>
                {!submitted ? (
                    <>
                        <div className="w-full flex flex-col p-4 gap-4 justify-start items-center pb-8">
                            <p className="text-center w-full">Answer {currentQuestion.submittedBy.username}'s question</p>
                            <textarea
                                className="w-full h-32 border-2 border-black rounded-md p-4"
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                            />
                        </div>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={submitAnswer}
                            disabled={loading}
                        >
                            Submit
                            {loading && (
                                <CircleNotch className="animate-spin" />
                            )}
                        </button>
                    </>
                ) : (
                    <>
                        <p>Answer submitted!</p>
                        <p>You answered: <i className="text-base text-gray-600">"{answerText}"</i></p>
                    </>
                )}
            </div>

            <PlayerStats />
        </>
    );
}

export default PlayerQuestionAnswer;