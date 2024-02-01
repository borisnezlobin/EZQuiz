import { ArrowRight } from "@phosphor-icons/react";
import CONFIG from "../../config";
import type { Room, Player } from "../../types/game";

const HostQuestionAnswer = ({ room, player }: { room: Room, player: Player }) => {
    const currentQuestion = room.questions[room.questionNumber - 1];
    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            <h1 className="text-4xl text-center">{currentQuestion.question}</h1>
            <p className="text-gray-700 text-sm">Submitted by {currentQuestion.submittedBy.username}</p>
            <p className="text-lg">{room.pendingAnswers.length} Answer{room.pendingAnswers.length == 1 ? "" : "s"}</p>
            <div className="absolute bottom-4 flex flex-row justify-center items-center">
                <button onClick={() => {
                    fetch(CONFIG.SERVER_URL + "/show-results", {
                        body: JSON.stringify({
                            roomId: room.id,
                            clientId: player.id,
                        }),
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                }}>
                    Next
                    <ArrowRight />
                </button>
            </div>
        </div>
    );
}

export default HostQuestionAnswer;