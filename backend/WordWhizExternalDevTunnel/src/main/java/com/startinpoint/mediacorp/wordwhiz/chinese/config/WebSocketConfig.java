package com.startinpoint.mediacorp.wordwhiz.chinese.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.ChannelInterceptorAdapter;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer  {

	private static final String[] DESTINATION_PREFIXES = {"/show/question/to/specific-player",
			"/show/question/to/all-player","/submit/answer", "/send/online-user", "/send/offline-user", "/get/online-users", "/all"};
  private static final String[] APP_DESTINATION_PREFIXES = {"/control-screen","/app-screen"};

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker(DESTINATION_PREFIXES);
		config.setApplicationDestinationPrefixes(APP_DESTINATION_PREFIXES);
		config.setUserDestinationPrefix("/external-device");
	}

	public void registerStompEndpoints(StompEndpointRegistry stompEndpointRegistry) {
		stompEndpointRegistry.addEndpoint("/ws")
      .setAllowedOriginPatterns("*").withSockJS()
      .setDisconnectDelay(1*1000);
	}

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.interceptors(new ChannelInterceptor() {
			@Override
			public Message<?> preSend(Message<?> message, MessageChannel channel) {
				StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
				if (StompCommand.CONNECT.equals(accessor.getCommand())) {
					String username = accessor.getFirstNativeHeader("username");
					if (!StringUtils.isEmpty(username)) {
						List<GrantedAuthority> authorities = new ArrayList<>();
						authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
						Authentication auth = new UsernamePasswordAuthenticationToken(username, username, authorities);
						SecurityContextHolder.getContext().setAuthentication(auth);
						accessor.setUser(auth);
					}
				}
				return message;
			}
		});
	}

}
