package com.example.chatie.Chatie.service.chatparticipant;

import com.example.chatie.Chatie.dto.chatparticipant.ChatParticipantDTO;
import com.example.chatie.Chatie.dto.chatparticipant.CreateChatParticipantDTO;
import com.example.chatie.Chatie.dto.chatparticipant.UpdateChatParticipantDTO;

import java.util.List;

public interface ChatParticipantService {

    // create
    ChatParticipantDTO createChatParticipant(CreateChatParticipantDTO dto);

    // read
    ChatParticipantDTO getById(Long id);
    List<ChatParticipantDTO> getByChatId(Long chatId);
    List<ChatParticipantDTO> getByUserId(Long userId);

    // update
    ChatParticipantDTO updateParticipant(UpdateChatParticipantDTO dto);

    // delete
    void deleteParticipant(Long chatId, Long userId);

    // check
    boolean isUserInChat(Long chatId, Long userId);



}
