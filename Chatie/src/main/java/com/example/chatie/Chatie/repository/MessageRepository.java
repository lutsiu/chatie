package com.example.chatie.Chatie.repository;

import com.example.chatie.Chatie.entity.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
       select m from Message m
       where m.chat.id = :chatId and m.deletedAt is null
       order by m.id desc
    """)
    List<Message> findPage(@Param("chatId") Long chatId, Pageable pageable);

    @Query("""
       select m from Message m
       where m.chat.id = :chatId and m.deletedAt is null and m.id < :beforeId
       order by m.id desc
    """)
    List<Message> findPageBefore(@Param("chatId") Long chatId,
                                 @Param("beforeId") Long beforeId,
                                 Pageable pageable);

    Optional<Message> findByIdAndDeletedAtIsNull(Long id);
}
