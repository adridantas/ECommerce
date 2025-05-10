package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {

    private Long id;
    private Long productId;
    private BigDecimal preco;
    private Integer quantidade;


}