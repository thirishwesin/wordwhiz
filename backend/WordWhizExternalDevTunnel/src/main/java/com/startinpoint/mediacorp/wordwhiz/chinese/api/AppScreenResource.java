package com.startinpoint.mediacorp.wordwhiz.chinese.api;

import com.startinpoint.mediacorp.wordwhiz.chinese.dto.Answer;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@RestController
@RequestMapping("/app-screen")
@RequiredArgsConstructor
public class AppScreenResource {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry simpUserRegistry;
    private static final String CONTROL_SCREEN = "control-screen";

    @MessageMapping("/submit/answer")
    public void submitAnswerToControlScreen(@Payload Answer answer, Principal principal){
        answer.setSendFrom(principal.getName());
        System.out.println("Answer: " + answer);
        this.messagingTemplate.convertAndSendToUser(answer.getSendTo(),
                "/submit/answer", answer);
    }

    @EventListener(SessionConnectedEvent.class)
    public void onSocketConnected(SessionConnectedEvent event) {
      if(!ObjectUtils.isEmpty(event.getUser())){
        String userName = event.getUser().getName();
        this.messagingTemplate.convertAndSendToUser(CONTROL_SCREEN,
          "/send/online-user", userName);
      }
    }

    @EventListener(SessionDisconnectEvent.class)
    public void onSocketDisconnected(SessionDisconnectEvent event) {
      if(!ObjectUtils.isEmpty(event.getUser())){
        String userName = event.getUser().getName();
        System.out.println("offline user: " + userName);
        this.messagingTemplate.convertAndSendToUser(CONTROL_SCREEN,
          "/send/offline-user", userName);
      }
    }
  }
