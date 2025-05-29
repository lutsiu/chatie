package com.example.chatie.Chatie.service.chat;

import com.example.chatie.Chatie.dto.chat.ChatDTO;
import com.example.chatie.Chatie.dto.chat.ChatUpdateDTO;
import com.example.chatie.Chatie.dto.chat.CreateChatDTO;

import java.util.List;
import java.util.Optional;

public interface ChatService {
    // GET
    ChatDTO getChatById(Long id);
    List<ChatDTO> getAllChats();
    Optional<ChatDTO> getChatByTitle(String title);

    List<ChatDTO> getChatsByCreatedById(Long id);

    List<ChatDTO> getGroupChats();
    List<ChatDTO> getPrivateChats();
    // POST
    ChatDTO createChat(CreateChatDTO dto);
    // UPDATE
    ChatDTO updateChat(Long chatId, ChatUpdateDTO dto);
    // DELETE
    void deleteChatById(Long chatId);
}
