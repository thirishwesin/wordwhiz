const data = {
    episodes: [
        {
            id: 1,
            players: [
                {
                    id: 1,
                    name: "Player name",
                    point: 200,
                    pointFontSize: 100
                }
            ],
            rounds: [
                {
                    orderNumber: 1,
                    orderName: "Round 1",
                    roundName: "SCRAMBLED WORD",
                    timers: [
                        "20s",
                        "10s",
                        "5s"
                    ],
                    points: [20, 10, 5],
                    questionGroups: [
                        {
                            id: 1,
                            groupName: ""
                        }
                    ],
                    questions: [
                        {
                            id: 1,
                            value: "What is this?",
                            questionGroupId: 1,
                            hints: [
                                {
                                    value: "LION",
                                    wordPositions: [],
                                    wordPositionsToShow: [],
                                    mainScreenHintFontSize: 45,
                                    onethirdScreenHintFontSize: 30,
                                }
                            ],
                            answer: "",
                            mainScreenquestionFontSize: 50,
                            onethirdScreenquestionFontSize: 40,
                        }
                    ],
                    marinScreenRoundNameFontSize: 59,
                    onethirdScreenRoundNameFontSize: 50,
                    mainScreenOrderNameFontSize: 70,
                    onethirdScreenOrderNameFontSize: 45
                }
            ]
        }
    ]
}

export default data;