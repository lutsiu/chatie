package com.example.chatie.Chatie.repository;

import com.example.chatie.Chatie.entity.ChatPinnedMessage;
import com.example.chatie.Chatie.entity.ChatPinnedMessageId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatPinnedMessageRepository
        extends JpaRepository<ChatPinnedMessage, ChatPinnedMessageId> {

    List<ChatPinnedMessage> findByChatIdOrderByPinnedAtDesc(Long chatId);
}
