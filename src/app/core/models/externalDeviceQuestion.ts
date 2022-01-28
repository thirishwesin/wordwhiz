

export interface ExternalDeviceQuestion {
  question: string
  hint: string
  timeout: number
  playerId: string
	currentQuestionId: number
  currentRoundId: number
  currentEpisodeId: number
}
