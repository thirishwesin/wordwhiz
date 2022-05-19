import { Question } from "./question";

export interface Round {
    roundId : number;
    gameLogicId : number;
    gameLogicName : string;
    timeout : number;
    scorePoint : number;
    questions: Question[];
}