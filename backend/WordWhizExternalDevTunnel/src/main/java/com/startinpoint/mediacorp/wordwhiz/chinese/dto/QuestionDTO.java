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
  private Boolean isLock;
  private FontSetting fontSetting;

  @Data
  public static class FontSetting {
    private Integer questionFontSize;
    private Integer hintFontSize;
    private Integer answerFontSize;
  }
}
