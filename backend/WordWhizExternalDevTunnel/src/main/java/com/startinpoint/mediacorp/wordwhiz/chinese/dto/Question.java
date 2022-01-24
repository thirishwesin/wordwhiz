package com.startinpoint.mediacorp.wordwhiz.chinese.dto;

public class Question {

  private String toPlayer;
  private String round;
  private String question;

  public Question() {
  }

  public String getToPlayer() {
    return toPlayer;
  }

  public void setToPlayer(String toPlayer) {
    this.toPlayer = toPlayer;
  }

  public String getQuestion() {
    return question;
  }

  public void setQuestion(String question) {
    this.question = question;
  }

  public String getRound() {
    return round;
  }

  public void setRound(String round) {
    this.round = round;
  }

  @Override
  public String toString() {
    return "Question{" +
      "toPlayer='" + toPlayer + '\'' +
      "round='" + round + '\'' +
      ", question='" + question + '\'' +
      '}';
  }
}
