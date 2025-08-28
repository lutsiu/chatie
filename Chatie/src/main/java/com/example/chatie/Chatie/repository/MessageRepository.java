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

    /* ---------- SEARCH (text + attachment filenames) ---------- */

    @Query("""
       select m from Message m
       where m.chat.id = :chatId
         and m.deletedAt is null
         and (
              lower(coalesce(m.content, '')) like lower(concat('%', :q, '%'))
              or exists (
                   select 1 from MessageAttachment a
                   where a.message = m
                     and lower(coalesce(a.originalName, '')) like lower(concat('%', :q, '%'))
              )
         )
       order by m.id desc
    """)
    List<Message> searchInChat(@Param("chatId") Long chatId,
                               @Param("q") String q,
                               Pageable pageable);

    @Query("""
       select m from Message m
       where m.chat.id = :chatId
         and m.deletedAt is null
         and m.id < :beforeId
         and (
              lower(coalesce(m.content, '')) like lower(concat('%', :q, '%'))
              or exists (
                   select 1 from MessageAttachment a
                   where a.message = m
                     and lower(coalesce(a.originalName, '')) like lower(concat('%', :q, '%'))
              )
         )
       order by m.id desc
    """)
    List<Message> searchInChatBefore(@Param("chatId") Long chatId,
                                     @Param("q") String q,
                                     @Param("beforeId") Long beforeId,
                                     Pageable pageable);
}
