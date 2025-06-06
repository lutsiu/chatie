package com.example.chatie.Chatie.service.chatparticipant;

import com.example.chatie.Chatie.dto.chatparticipant.ChatParticipantDTO;
import com.example.chatie.Chatie.dto.chatparticipant.CreateChatParticipantDTO;
import com.example.chatie.Chatie.dto.chatparticipant.UpdateChatParticipantDTO;
import com.example.chatie.Chatie.entity.Chat;
import com.example.chatie.Chatie.entity.ChatParticipant;
import com.example.chatie.Chatie.entity.User;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.mapper.ChatParticipantMapper;
import com.example.chatie.Chatie.repository.ChatParticipantRepository;
import com.example.chatie.Chatie.repository.ChatRepository;
import com.example.chatie.Chatie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatParticipantServiceImpl implements ChatParticipantService {

    private final ChatParticipantRepository chatParticipantRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;


    @Override
    @Transactional
    public ChatParticipantDTO createChatParticipant(CreateChatParticipantDTO dto) {
        Chat chat = chatRepository
                .findById(dto.getChatId())
                .orElseThrow(() ->
                    new NotFoundException("Chat not found with ID:" +
                    dto.getChatId()));
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new NotFoundException("Chat not found with ID:"
                        + dto.getUserId()));

        ChatParticipant chatParticipant = ChatParticipantMapper
                .toEntity(dto, chat, user);
        ChatParticipant savedParticipant = chatParticipantRepository.save(chatParticipant);

        return ChatParticipantMapper.toDTO(savedParticipant);
    }

    @Override
    public ChatParticipantDTO getById(Long id) {
        ChatParticipant participant =  chatParticipantRepository
                .findById(id).orElseThrow(() ->
                        new NotFoundException("ChatParticipant not found with ID:" +
                                id));
        return ChatParticipantMapper.toDTO(participant);
    }

    @Override
    public List<ChatParticipantDTO> getByChatId(Long chatId) {
        List<ChatParticipant> participants =  chatParticipantRepository
                .findByChatId(chatId);
        return participants.stream()
                .map(ChatParticipantMapper::toDTO).toList();
    }

    @Override
    public List<ChatParticipantDTO> getByUserId(Long userId) {
        List<ChatParticipant> participants =  chatParticipantRepository
                .findByUserId(userId);
        return participants.stream()
                .map(ChatParticipantMapper::toDTO).toList();
    }

    @Override
    public ChatParticipantDTO updateParticipant(UpdateChatParticipantDTO dto) {
        ChatParticipant participant = chatParticipantRepository.findById(dto.getId())
                .orElseThrow(() -> new NotFoundException("ChatParticipant not found with ID: " + dto.getId()));
        ChatParticipantMapper.updateFromDTO(participant, dto);
        ChatParticipant updated = chatParticipantRepository.save(participant);
        return ChatParticipantMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteParticipant(Long chatId, Long userId) {
        ChatParticipant participant = chatParticipantRepository.findByChatIdAndUserId(chatId, userId)
                .orElseThrow(() -> new NotFoundException("Participant not found for chatId: " + chatId + " and userId: " + userId));
        chatParticipantRepository.delete(participant);
    }

    @Override
    public boolean isUserInChat(Long chatId, Long userId) {
        return chatParticipantRepository.existsByChatIdAndUserId(chatId, userId);
    }
}
