package com.startinpoint.mediacorp.wordwhiz.chinese.api;

import com.startinpoint.mediacorp.wordwhiz.chinese.dto.Answer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/app-screen")
public class AppScreenResource {

    private final SimpMessagingTemplate messagingTemplate;
    private final SimpUserRegistry simpUserRegistry;
    private static final String CONTROL_SCREEN = "control-screen";

    @Autowired
    public AppScreenResource(SimpMessagingTemplate messagingTemplate, SimpUserRegistry simpUserRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.simpUserRegistry = simpUserRegistry;
    }

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
        this.messagingTemplate.convertAndSendToUser(CONTROL_SCREEN,
          "/send/offline-user", userName);
      }
    }

    @MessageMapping("/send/online-users")
    public void getOnlineUsers(){
      List<String> onlineUsers = this.simpUserRegistry.getUsers().stream().map(SimpUser::getName)
        .collect(Collectors.toList());
      System.out.println("online users: " + onlineUsers);
      this.messagingTemplate.convertAndSendToUser(CONTROL_SCREEN,
        "/send/online-users", onlineUsers);
    }

  }
