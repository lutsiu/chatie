package com.example.chatie.Chatie.ws;

import com.example.chatie.Chatie.dto.ws.WsEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class WsEventPublisherImpl implements WsEventPublisher {

    private final SimpMessagingTemplate template;

    @Override
    public void sendToChat(Long chatId, WsEvent<?> event) {
        String dest = "/topic/chats." + chatId; // client subscribes here
        template.convertAndSend(dest, event);
        log.debug("WS -> {} type={}", dest, event.getType());
    }
}
