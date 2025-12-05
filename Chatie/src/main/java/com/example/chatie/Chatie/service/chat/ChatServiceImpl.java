package com.example.chatie.Chatie.service.chat;

import com.example.chatie.Chatie.dto.chat.ChatDTO;
import com.example.chatie.Chatie.entity.Chat;
import com.example.chatie.Chatie.entity.User;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.mapper.ChatMapper;
import com.example.chatie.Chatie.repository.ChatRepository;
import com.example.chatie.Chatie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Override
    public ChatDTO getById(Long id) {
        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Chat not found with ID: " + id));
        return ChatMapper.toDTO(chat);
    }

    @Override
    public List<ChatDTO> listForUser(Long userId) {
        return chatRepository.findAllForUserOrderByActivity(userId)
                .stream().map(ChatMapper::toDTO).toList();
    }

    @Override
    @Transactional
    public ChatDTO getOrCreate(Long meId, Long otherUserId) {
        if (meId.equals(otherUserId)) {
            throw new IllegalArgumentException("A chat requires two distinct users");
        }

        Long first = Math.min(meId, otherUserId);
        Long second = Math.max(meId, otherUserId);

        return chatRepository.findByUserPair(first, second)
                .map(ChatMapper::toDTO)
                .orElseGet(() -> {
                    User u1 = userRepository.findById(first)
                            .orElseThrow(() -> new NotFoundException("User not found: " + first));
                    User u2 = userRepository.findById(second)
                            .orElseThrow(() -> new NotFoundException("User not found: " + second));

                    Chat saved = chatRepository.save(ChatMapper.toEntity(u1, u2));
                    return ChatMapper.toDTO(saved);
                });
    }

    @Override
    @Transactional
    public void deleteById(Long chatId) {
        if (!chatRepository.existsById(chatId)) {
            throw new NotFoundException("Chat not found with ID: " + chatId);
        }
        chatRepository.deleteById(chatId);
    }
}
