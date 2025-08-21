package com.example.chatie.Chatie.repository;

import com.example.chatie.Chatie.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    // All chats where the user participates
    List<Chat> findByUser1IdOrUser2Id(Long userId1, Long userId2);

    // Pair lookup regardless of order
    @Query("""
      select c from Chat c
      where (c.user1.id = :a and c.user2.id = :b)
         or (c.user1.id = :b and c.user2.id = :a)
    """)
    Optional<Chat> findByUserPair(Long a, Long b);
}
