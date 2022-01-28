package com.startinpoint.mediacorp.wordwhiz.chinese.api;

import com.startinpoint.mediacorp.wordwhiz.chinese.dto.Question;
import com.startinpoint.mediacorp.wordwhiz.chinese.dto.QuestionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/control-screen")
@RequiredArgsConstructor
public class ControlScreenResource {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry simpUserRegistry;
    private static final String CONTROL_SCREEN = "control-screen";

    @MessageMapping("/show/question/to/specific-player")
    public void showQuestionToSpecificPlayer(@Payload QuestionDTO questionDTO){
      System.out.println("QuestionDTO For Specific Player: " + questionDTO);
      Question question = new Question(questionDTO.getPlayerId(), questionDTO.getCurrentRoundId(),
        questionDTO.getQuestion(), questionDTO.getHint());
      System.out.println("question: " + question);
      this.messagingTemplate.convertAndSendToUser(question.getToPlayer(),
                "/show/question/to/specific-player", question);
    }

    @MessageMapping("/show/question/to/all-player")
    public void showQuestionToAllPlayer(@Payload QuestionDTO questionDTO){
        System.out.println("Question For All Player: " + questionDTO);
      Question question = new Question(questionDTO.getPlayerId(), questionDTO.getCurrentRoundId(),
        questionDTO.getQuestion(), questionDTO.getHint());
        this.messagingTemplate.convertAndSend("/show/question/to/all-player", question);
    }

    @MessageMapping("/get/online-users")
    private void getOnlineUsers() throws InterruptedException {
      List<String> onlineUsers = this.simpUserRegistry.getUsers().stream().map(SimpUser::getName)
        .collect(Collectors.toList());
      System.out.println("online users: " + onlineUsers);
      Thread.sleep(1000);
      this.messagingTemplate.convertAndSendToUser(CONTROL_SCREEN,
        "/get/online-users", onlineUsers);
    }
}
