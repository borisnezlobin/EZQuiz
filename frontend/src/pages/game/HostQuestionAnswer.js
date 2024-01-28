const HostQuestionAnswer = ({ room, player, setRoom }) => {
    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            <h1 className="text-4xl">{room.currentQuestion.question}</h1>
            <p>{room.questionAnswers.length} Answer{room.questionAnswers.length == 1 ? "" : "s"}</p>
        </div>
    );
}

export default HostQuestionAnswer;