package com.startinpoint.mediacorp.wordwhiz.chinese.dto;

public class Answer {

	private String answer;
	private String sendFrom;
	private String sendTo;
	private String answerIndex;
	private String scrambleBtnId;

	public Answer() {
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public String getSendFrom() {
		return sendFrom;
	}

	public void setSendFrom(String sendFrom) {
		this.sendFrom = sendFrom;
	}

	public String getSendTo() {
		return sendTo;
	}

	public void setSendTo(String sendTo) {
		this.sendTo = sendTo;
	}

	public String getAnswerIndex() {
		return answerIndex;
	}

	public void setAnswerIndex(String answerIndex) {
		this.answerIndex = answerIndex;
	}
	
	public String getScrambleBtnId() {
		return scrambleBtnId;
	}

	public void setScrambleBtnId(String scrambleBtnId) {
		this.scrambleBtnId = scrambleBtnId;
	}

	@Override
	public String toString() {
		return "Answer [answer=" + answer + ", sendFrom=" + sendFrom + ", sendTo=" + sendTo + ", answerIndex="
				+ answerIndex + ", scrambleBtnId=" + scrambleBtnId + "]";
	}
	
	
}
