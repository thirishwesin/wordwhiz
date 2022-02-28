package com.startinpoint.mediacorp.wordwhiz.chinese.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Question {

  private String toPlayer;
  private int round;
  private int questionId;
  private String question;
  private String hint;
  private Boolean isLock;
  private QuestionDTO.FontSetting fontSetting;

}
