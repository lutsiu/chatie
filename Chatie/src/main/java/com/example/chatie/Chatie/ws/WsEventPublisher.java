package com.example.chatie.Chatie.ws;

import com.example.chatie.Chatie.dto.ws.WsEvent;

public interface WsEventPublisher {
    void sendToChat(Long chatId, WsEvent<?> event);
}
