package com.example.chatie.Chatie.service.message;

import com.example.chatie.Chatie.dto.message.CreateMessageDTO;
import com.example.chatie.Chatie.dto.message.EditMessageDTO;
import com.example.chatie.Chatie.dto.message.MessageDTO;
import com.example.chatie.Chatie.dto.ws.WsEvent;
import com.example.chatie.Chatie.entity.*;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.mapper.MessageMapper;
import com.example.chatie.Chatie.repository.ChatPinnedMessageRepository;
import com.example.chatie.Chatie.repository.ChatRepository;
import com.example.chatie.Chatie.repository.MessageRepository;
import com.example.chatie.Chatie.repository.UserRepository;
import com.example.chatie.Chatie.ws.WsEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messages;
    private final ChatRepository chats;
    private final UserRepository users;
    private final ChatPinnedMessageRepository pins;

    // WS publisher
    private final WsEventPublisher ws;

    private void ensureParticipant(Chat chat, Long userId) {
        Long u1 = (chat.getUser1() != null) ? chat.getUser1().getId() : null;
        Long u2 = (chat.getUser2() != null) ? chat.getUser2().getId() : null;
        if (!Objects.equals(u1, userId) && !Objects.equals(u2, userId)) {
            throw new IllegalStateException("Sender is not a participant of this chat.");
        }
    }

    private void touchChatWith(Message saved, Chat chat) {
        chat.setLastMessage(saved);
        chat.setLastMessageAt(saved.getCreatedAt());
        chat.setLastMessagePreview(MessageMapper.buildPreview(saved));
        chats.save(chat);
    }

    @Override
    @Transactional
    public MessageDTO create(CreateMessageDTO dto) {
        if ((dto.getContent() == null || dto.getContent().isBlank())
                && (dto.getAttachments() == null || dto.getAttachments().isEmpty())) {
            throw new IllegalArgumentException("Message must have text or attachments.");
        }

        Chat chat = chats.findWithUsersById(dto.getChatId())
                .orElseThrow(() -> new NotFoundException("Chat not found: " + dto.getChatId()));
        User sender = users.findById(dto.getSenderId())
                .orElseThrow(() -> new NotFoundException("Sender not found: " + dto.getSenderId()));
        ensureParticipant(chat, sender.getId());

        Message replyTo = null;
        if (dto.getReplyToId() != null) {
            replyTo = messages.findByIdAndDeletedAtIsNull(dto.getReplyToId())
                    .orElseThrow(() -> new NotFoundException("Reply target not found: " + dto.getReplyToId()));
            if (!Objects.equals(replyTo.getChat().getId(), chat.getId())) {
                throw new IllegalArgumentException("Reply must be within the same chat.");
            }
        }

        Message m = MessageMapper.toEntity(dto, sender, chat, replyTo);

        if (dto.getAttachments() != null && !dto.getAttachments().isEmpty()) {
            int pos = 0;
            for (var a : dto.getAttachments()) {
                m.getAttachments().add(
                        MessageAttachment.builder()
                                .message(m)
                                .url(a.getUrl())
                                .mime(a.getMime())
                                .sizeBytes(a.getSizeBytes())
                                .width(a.getWidth())
                                .height(a.getHeight())
                                .durationSec(a.getDurationSec())
                                .originalName(a.getOriginalName())
                                .position(a.getPosition() != null ? a.getPosition() : pos++)
                                .build()
                );
            }
        }

        Message saved = messages.save(m);
        touchChatWith(saved, chat);

        MessageDTO out = MessageMapper.toDTO(saved);
        ws.sendToChat(chat.getId(), new WsEvent<>("message.created", chat.getId(), out));
        return out;
    }

    @Override
    @Transactional
    public MessageDTO edit(Long id, EditMessageDTO body) {
        Message m = messages.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new NotFoundException("Message not found"));

        if (m.getType() != MessageType.TEXT
                && m.getType() != MessageType.FILE
                && m.getType() != MessageType.IMAGE
                && m.getType() != MessageType.VIDEO) {
            throw new IllegalStateException("Editing not supported for this type.");
        }

        m.setContent(body.getContent());
        m.setEditedAt(LocalDateTime.now());
        Message saved = messages.save(m);

        Chat chat = saved.getChat();
        if (chat.getLastMessage() != null && Objects.equals(chat.getLastMessage().getId(), saved.getId())) {
            chat.setLastMessagePreview(MessageMapper.buildPreview(saved));
            chats.save(chat);
        }

        MessageDTO out = MessageMapper.toDTO(saved);
        ws.sendToChat(chat.getId(), new WsEvent<>("message.edited", chat.getId(), out));
        return out;
    }

    @Override
    @Transactional
    public void softDelete(Long id) {
        Message m = messages.findById(id)
                .orElseThrow(() -> new NotFoundException("Message not found"));
        if (m.getDeletedAt() != null) return;

        m.setDeletedAt(LocalDateTime.now());
        Message saved = messages.save(m);

        Chat chat = saved.getChat();
        if (chat.getLastMessage() != null && Objects.equals(chat.getLastMessage().getId(), saved.getId())) {
            var next = messages.findPage(chat.getId(), PageRequest.of(0, 1))
                    .stream()
                    .filter(x -> !Objects.equals(x.getId(), saved.getId()))
                    .findFirst();

            chat.setLastMessage(next.orElse(null));
            chat.setLastMessageAt(next.map(Message::getCreatedAt).orElse(null));
            chat.setLastMessagePreview(next.map(MessageMapper::buildPreview).orElse(null));
            chats.save(chat);
        }

        MessageDTO out = MessageMapper.toDTO(saved);
        ws.sendToChat(chat.getId(), new WsEvent<>("message.deleted", chat.getId(), out));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> page(Long chatId, Integer pageSize, Long beforeId) {
        int size = (pageSize == null || pageSize < 1 || pageSize > 100) ? 50 : pageSize;
        var pageable = PageRequest.of(0, size);

        var list = (beforeId == null)
                ? messages.findPage(chatId, pageable)
                : messages.findPageBefore(chatId, beforeId, pageable);

        return list.stream().map(MessageMapper::toDTO).toList();
    }

    @Override
    @Transactional
    public void pin(Long chatId, Long messageId, Long pinnedByUserId) {
        Chat chat = chats.findById(chatId)
                .orElseThrow(() -> new NotFoundException("Chat not found"));
        Message msg = messages.findByIdAndDeletedAtIsNull(messageId)
                .orElseThrow(() -> new NotFoundException("Message not found"));
        if (!Objects.equals(msg.getChat().getId(), chat.getId())) {
            throw new IllegalArgumentException("Message doesn't belong to chat.");
        }
        User user = users.findById(pinnedByUserId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        var id = new ChatPinnedMessageId(chat.getId(), msg.getId());
        if (!pins.existsById(id)) {
            var pin = ChatPinnedMessage.builder()
                    .id(id)
                    .chat(chat)
                    .message(msg)
                    .pinnedBy(user)
                    .build();
            pins.save(pin);
        }

        ws.sendToChat(chatId, new WsEvent<>("message.pinned", chatId, messageId));
    }

    @Override
    @Transactional
    public void unpin(Long chatId, Long messageId) {
        var id = new ChatPinnedMessageId(chatId, messageId);
        pins.deleteById(id);

        ws.sendToChat(chatId, new WsEvent<>("message.unpinned", chatId, messageId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> listPinned(Long chatId) {
        return pins.findByChatIdOrderByPinnedAtDesc(chatId)
                .stream()
                .map(pm -> MessageMapper.toDTO(pm.getMessage()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> search(Long chatId, String rawQ, Integer pageSize, Long beforeId) {
        String q = rawQ == null ? "" : rawQ.trim();
        if (q.isEmpty()) return List.of();

        int size = (pageSize == null || pageSize < 1 || pageSize > 100) ? 50 : pageSize;
        var pageable = PageRequest.of(0, size);

        var list = (beforeId == null)
                ? messages.searchInChat(chatId, q, pageable)
                : messages.searchInChatBefore(chatId, q, beforeId, pageable);

        return list.stream().map(MessageMapper::toDTO).toList();
    }
}
