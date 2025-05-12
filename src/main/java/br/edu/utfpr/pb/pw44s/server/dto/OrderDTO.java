package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;
    private LocalDateTime data;
    private Long userId;
    private List<OrderItemDTO> items;
}