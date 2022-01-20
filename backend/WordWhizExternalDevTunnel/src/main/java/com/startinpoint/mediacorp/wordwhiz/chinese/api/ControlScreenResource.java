package com.startinpoint.mediacorp.wordwhiz.chinese.api;

import com.startinpoint.mediacorp.wordwhiz.chinese.dto.Question;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/control-screen")
public class ControlScreenResource {

    private final SimpMessagingTemplate messagingTemplate;

    public ControlScreenResource(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/show/question/to/specific-player")
    public void showQuestionToSpecificPlayer(@Payload Question question){
        System.out.println("Question For Specific Player: " + question);
        this.messagingTemplate.convertAndSendToUser(question.getToPlayer(),
                "/show/question/to/specific-player", question);
    }

    @MessageMapping("/show/question/to/all-player")
    public void showQuestionToAllPlayer(@Payload Question question){
        System.out.println("Question For All Player: " + question);
        this.messagingTemplate.convertAndSend("/show/question/to/all-player", question);
    }
}
