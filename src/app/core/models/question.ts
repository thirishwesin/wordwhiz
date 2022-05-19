import { Font } from "./font";

export interface Question {
    questionId : number;
    question : string;
    answer : string;
    ui : {
        font: Font
    };
}