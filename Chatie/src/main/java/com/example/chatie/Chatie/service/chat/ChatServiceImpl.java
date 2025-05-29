package com.example.chatie.Chatie.service.chat;

import com.example.chatie.Chatie.dto.chat.ChatDTO;
import com.example.chatie.Chatie.dto.chat.ChatUpdateDTO;
import com.example.chatie.Chatie.dto.chat.CreateChatDTO;
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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Override
    public ChatDTO getChatById(Long id) {
        Chat chat = chatRepository.findById(id).orElseThrow(
                () -> new NotFoundException(("Chat not found with ID: " + id)));
        return ChatMapper.toDTO(chat);
    }

    @Override
    public List<ChatDTO> getAllChats() {
        List<Chat> chats = chatRepository.findAll();
        return convertChatListToDTOList(chats);
    }

    @Override
    public Optional<ChatDTO> getChatByTitle(String title) {
        Optional<Chat> possibleChat = chatRepository.findByTitle(title);
        return possibleChat.map(ChatMapper::toDTO);
    }

    @Override
    public List<ChatDTO> getChatsByCreatedById(Long id) {
        List<Chat> chats = chatRepository.findByCreatedById(id);
        return convertChatListToDTOList(chats);
    }

    @Override
    public List<ChatDTO> getGroupChats() {
        List<Chat> groupChats = chatRepository.findByGroupTrue();
        return convertChatListToDTOList(groupChats);
    }

    @Override
    public List<ChatDTO> getPrivateChats() {
        List<Chat> groupChats = chatRepository.findByGroupFalse();
        return convertChatListToDTOList(groupChats);
    }

    @Override
    @Transactional
    public ChatDTO createChat(CreateChatDTO dto) {
        User user = userRepository.findById(dto.getCreatedById())
                .orElseThrow(()
                        -> new NotFoundException(
                                "User not found with ID: " + dto.getCreatedById()));
        Chat chat = ChatMapper.toEntity(dto, user);
        Chat savedChat = chatRepository.save(chat);
        return ChatMapper.toDTO(savedChat);
    }

    @Override
    @Transactional
    public ChatDTO updateChat(Long chatId, ChatUpdateDTO dto) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new NotFoundException("Chat not found with ID: " + chatId));

        if (dto.getTitle() != null && !dto.getTitle().isBlank()) {
            chat.setTitle(dto.getTitle());
        }

        Chat updatedChat = chatRepository.save(chat);
        return ChatMapper.toDTO(updatedChat);
    }

    @Override
    @Transactional
    public void deleteChatById(Long chatId) {
        if (!chatRepository.existsById(chatId)) {
            throw new NotFoundException(("Chat not found with ID: " + chatId));
        }
        chatRepository.deleteById(chatId);
    }

    private List<ChatDTO> convertChatListToDTOList(List<Chat> chats) {
        return chats.stream().map(ChatMapper::toDTO).toList();
    }
}
