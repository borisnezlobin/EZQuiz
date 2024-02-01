export type Player = {
    id: string;
    username: string;
    score: number;
    isHost: boolean;
    connection: any; // TODO: fix
};

export type PlayerAnswer = {
    player: Player;
    username: string;
    answer: string;
    score: number;
};

export type Question = {
    id: string;
    question: string;
    submittedBy: Player;
    answer: string;
    options: string[];
    answers: PlayerAnswer[];
    used: boolean;
};

export type Room = {
    id: string;
    host: Player;
    players: Player[];
    questions: Question[];
    pendingAnswers: PlayerAnswer[];
    questionNumber: number;
    createdAt: number;
}