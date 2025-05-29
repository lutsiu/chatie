package com.example.chatie.Chatie.repository;


import com.example.chatie.Chatie.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    List<Chat> findByCreatedById(Long userId); // find chats created by a specific user
    List<Chat> findByGroupTrue(); // find only group chats
    List<Chat> findByGroupFalse(); // find only private chats
}
