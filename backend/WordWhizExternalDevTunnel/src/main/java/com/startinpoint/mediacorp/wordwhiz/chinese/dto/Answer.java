package com.startinpoint.mediacorp.wordwhiz.chinese.dto;

public class Answer {

  private String answer;
  private String sendFrom;
  private String sendTo;

  public Answer(){}

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

  @Override
  public String toString() {
    return "Answer{" +
      "answer='" + answer + '\'' +
      ", sendFrom='" + sendFrom + '\'' +
      ", sendTo='" + sendTo + '\'' +
      '}';
  }
}
