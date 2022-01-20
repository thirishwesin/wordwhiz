package com.startinpoint.mediacorp.wordwhiz.chinese.api;

import com.startinpoint.mediacorp.wordwhiz.chinese.dto.Answer;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/app-screen")
public class AppScreenResource {

    private final SimpMessagingTemplate messagingTemplate;

    public AppScreenResource(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/submit/answer")
    public void submitAnswerToControlScreen(@Payload Answer answer, Principal principal){
        answer.setSendFrom(principal.getName());
        System.out.println("Answer: " + answer);
        this.messagingTemplate.convertAndSendToUser(answer.getSendTo(),
                "/submit/answer", answer);
    }
}
