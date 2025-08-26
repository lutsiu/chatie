package com.example.chatie.Chatie.repository;

import com.example.chatie.Chatie.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    // Pair lookup regardless of order
    @Query("""
      select c from Chat c
      where (c.user1.id = :a and c.user2.id = :b)
         or (c.user1.id = :b and c.user2.id = :a)
    """)
    Optional<Chat> findByUserPair(Long a, Long b);

    // List chats for a user, newest activity first
    @Query("""
      select c from Chat c
      where c.user1.id = :userId or c.user2.id = :userId
      order by coalesce(c.lastMessageAt, c.updatedAt) desc
    """)
    List<Chat> findAllForUserOrderByActivity(Long userId);
    @Query("""
        select c from Chat c
        join fetch c.user1
        join fetch c.user2
        where c.id = :id
    """)
    Optional<Chat> findWithUsersById(@Param("id") Long id);
}
