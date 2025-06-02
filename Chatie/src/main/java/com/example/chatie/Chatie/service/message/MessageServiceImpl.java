package com.example.chatie.Chatie.service.message;

import com.example.chatie.Chatie.dto.message.CreateMessageDTO;
import com.example.chatie.Chatie.dto.message.MessageDTO;
import com.example.chatie.Chatie.entity.Chat;
import com.example.chatie.Chatie.entity.Message;
import com.example.chatie.Chatie.entity.User;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.mapper.MessageMapper;
import com.example.chatie.Chatie.repository.ChatRepository;
import com.example.chatie.Chatie.repository.MessageRepository;
import com.example.chatie.Chatie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public MessageDTO createMessage(CreateMessageDTO dto) {
        Chat chat = chatRepository.findById(dto.getChatId())
                .orElseThrow(() ->
                        new NotFoundException("Chat not found with ID: " + dto.getChatId()));
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() ->
                        new NotFoundException("User not found with ID: " + dto.getSenderId()));

        Message message = MessageMapper.toEntity(dto, sender, chat);
        Message savedMessage = messageRepository.save(message);
        return MessageMapper.toDTO(savedMessage);
    }

    @Override
    public MessageDTO getMessageById(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Message not found with ID: " + id));
        return MessageMapper.toDTO(message);
    }

    @Override
    public List<MessageDTO> getMessagesByChatId(Long chatId) {
        return messageRepository.findByChatId(chatId)
                .stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageDTO> getMessagesBySenderId(Long senderId) {
        return messageRepository.findBySenderId(senderId)
                .stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteMessage(Long messageId) {
        if (!messageRepository.existsById(messageId)) {
            throw new NotFoundException("Message not found with ID: " + messageId);
        }
        messageRepository.deleteById(messageId);
    }
}
