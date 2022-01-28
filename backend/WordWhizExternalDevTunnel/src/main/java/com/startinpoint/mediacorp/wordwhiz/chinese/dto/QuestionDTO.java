package com.startinpoint.mediacorp.wordwhiz.chinese.dto;

import lombok.Data;

@Data
public class QuestionDTO {

  private String question;
  private String hint;
  private int timeout;
  private String playerId;
  private int currentQuestionId;
  private int currentRoundId;
  private int currentEpisodeId;
}
