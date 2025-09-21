package com.example.chatie.Chatie.controller;

import com.example.chatie.Chatie.dto.message.AttachmentInputDTO;
import com.example.chatie.Chatie.dto.message.CreateMessageDTO;
import com.example.chatie.Chatie.dto.message.EditMessageDTO;
import com.example.chatie.Chatie.dto.message.MessageDTO;
import com.example.chatie.Chatie.service.media.CloudinaryService;
import com.example.chatie.Chatie.service.message.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService service;
    private final CloudinaryService cloudinary;

    /* -------------------- CRUD -------------------- */

    // Create message (JSON with optional attachments URLs)
    @PostMapping
    public ResponseEntity<MessageDTO> create(@Valid @RequestBody CreateMessageDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    // Edit text/caption
    @PatchMapping("/{id}")
    public ResponseEntity<MessageDTO> edit(
            @PathVariable Long id,
            @RequestBody EditMessageDTO body
    ) {
        return ResponseEntity.ok(service.edit(id, body));
    }

    // Soft delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    // Page (newest first), beforeId for infinite scroll
    @GetMapping("/by-chat/{chatId}")
    public ResponseEntity<List<MessageDTO>> page(
            @PathVariable Long chatId,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Long beforeId
    ) {
        return ResponseEntity.ok(service.page(chatId, limit, beforeId));
    }

    /* -------------------- Pinned -------------------- */

    @PostMapping("/pin")
    public ResponseEntity<Void> pin(
            @RequestParam Long chatId,
            @RequestParam Long messageId,
            @RequestParam Long userId   // keep until /me is wired
    ) {
        service.pin(chatId, messageId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<MessageDTO>> search(
            @RequestParam Long chatId,
            @RequestParam String q,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Long beforeId
    ) {
        return ResponseEntity.ok(service.search(chatId, q, limit, beforeId));
    }

    @DeleteMapping("/pin")
    public ResponseEntity<Void> unpin(
            @RequestParam Long chatId,
            @RequestParam Long messageId
    ) {
        service.unpin(chatId, messageId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pin/{chatId}")
    public ResponseEntity<List<MessageDTO>> listPinned(@PathVariable Long chatId) {
        return ResponseEntity.ok(service.listPinned(chatId));
    }

    /* -------------------- Uploads (Cloudinary) -------------------- */

    /**
     * Upload one or more files for a message to Cloudinary and return
     * an array of AttachmentInputDTO objects that can be sent directly
     * in the body of POST /api/messages.
     *
     * Form-data:
     *   - chatId:   long
     *   - senderId: long
     *   - files:    MultipartFile[]  (key: "files")
     *   - positions (optional): Integer[] to preserve mosaic order
     *   - publicIds (optional): String[] hints for Cloudinary public_id
     */
    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<List<AttachmentInputDTO>> uploadMessageFiles(
            @RequestParam long chatId,
            @RequestParam long senderId,
            @RequestPart("files") MultipartFile[] files,
            @RequestParam(required = false) Integer[] positions,
            @RequestParam(required = false) String[] publicIds
    ) {
        List<AttachmentInputDTO> out = new ArrayList<>();
        if (files != null) {
            for (int i = 0; i < files.length; i++) {
                var up = cloudinary.uploadMessageMedia(
                        chatId,
                        senderId,
                        files[i],
                        (publicIds != null && publicIds.length > i) ? publicIds[i] : null
                );

                out.add(AttachmentInputDTO.builder()
                        .url(up.getUrl())
                        .mime(up.getMime())
                        .sizeBytes(up.getBytes())
                        .width(up.getWidth())
                        .height(up.getHeight())
                        .durationSec(up.getDurationSec())
                        .originalName(up.getOriginalName())
                        .position((positions != null && positions.length > i) ? positions[i] : i)
                        .build());
            }
        }
        return ResponseEntity.ok(out);
    }
}
