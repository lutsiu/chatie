package com.example.chatie.Chatie.service.message;

import com.example.chatie.Chatie.dto.message.*;

import java.util.List;

public interface MessageService {
    MessageDTO create(CreateMessageDTO dto);
    MessageDTO edit(Long id, EditMessageDTO body);
    void softDelete(Long id);

    // pagination
    List<MessageDTO> page(Long chatId, Integer pageSize, Long beforeId);

    // pinned
    void pin(Long chatId, Long messageId, Long pinnedByUserId);
    void unpin(Long chatId, Long messageId);
    List<MessageDTO> listPinned(Long chatId);
}
