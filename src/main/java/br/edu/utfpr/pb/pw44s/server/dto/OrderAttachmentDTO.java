package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.AttachmentType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderAttachmentDTO {
    private Long id;
    private String fileName;
    private String fileUrl;
    private AttachmentType type;
    private LocalDateTime uploadedAt;
}
