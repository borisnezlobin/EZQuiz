import { ArrowRight } from "@phosphor-icons/react";

const HostShowResults = ({ room, player }) => {
    // TODO: show top 5 from room.players
    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            <h1 className="text-6xl">Results (Question {room.questionNumber})</h1>
            <p>{room.currentQuestion.question.question}</p>
            <div className="absolute bottom-4 flex flex-row justify-center items-center">
                <button onClick={() => {
                    fetch("http://localhost:9000/next-question", {
                        body: JSON.stringify({
                            // TODO:
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
    )
}

export default HostShowResults;