

export interface ExternalDeviceQuestion {
  question: string
  hint: string
  timeout: number
  playerId: string
	currentQuestionId: number
  currentRoundId: number
  currentEpisodeId: number
  isLock: boolean
  fontSetting: FontSetting
}

export interface FontSetting{
  questionFontSize: number
  hintFontSize: number
  answerFontSize: number
}
