package com.example.chatie.Chatie.dto.ws;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WsEvent<T> {
    private String type;   // e.g. "message.created"
    private Long chatId;   // which chat this event belongs to
    private T payload;     // DTO body
}
