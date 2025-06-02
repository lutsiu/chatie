package com.example.chatie.Chatie.service.message;

import com.example.chatie.Chatie.dto.message.CreateMessageDTO;
import com.example.chatie.Chatie.dto.message.MessageDTO;

import java.util.List;

public interface MessageService {
    // CREATE
    MessageDTO createMessage(CreateMessageDTO dto);

    // READ
    MessageDTO getMessageById(Long id);
    List<MessageDTO> getMessagesByChatId(Long chatId);
    List<MessageDTO> getMessagesBySenderId(Long senderId);

    // DELETE
    void deleteMessage(Long messageId);
}
