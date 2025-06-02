package com.example.chatie.Chatie.repository;

import com.example.chatie.Chatie.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatId(Long chatId);
    List<Message> findBySenderId(Long senderId);
    List<Message> findTop20ByChatIdOrderByCreatedAtDesc(Long chatId);

}
