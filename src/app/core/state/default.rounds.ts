import { Round } from "../models/round";

export const rounds: Round[] = [
    {
        "roundId": 1,
        "gameLogicId": 1,
        "gameLogicName": "SCRAMBLED WORD",
        "timeout": 15,
        "scorePoint": 10,
        "questions": [
            {
                "questionId": 1,
                "question": "GOAT",
                "answer": "ROLANDO",
                "ui": {
                    "font": {
                        "question": 23,
                        "answer": 23
                    }
                }
            }
        ]
    },
    {
        "roundId": 2,
        "gameLogicId": 1,
        "gameLogicName": "SCRAMBLED WORD",
        "timeout": 15,
        "scorePoint": 10,
        "questions": [
            {
                "questionId": 1,
                "question": "HELLO",
                "answer": "WORLD",
                "ui": {
                    "font": {
                        "question": 23,
                        "answer": 23
                    }
                }
            }
        ]
    },
    {
        "roundId": 3,
        "gameLogicId": 2,
        "gameLogicName": "TYPE WORD",
        "timeout": 15,
        "scorePoint": 10,
        "questions": [
            {
                "questionId": 1,
                "question": "TYPE",
                "answer": "WORD",
                "ui": {
                    "font": {
                        "question": 23,
                        "answer": 23
                    }
                }
            }
        ]
    }
]