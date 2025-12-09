package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {
    private Long id;

    @NotNull
    private String logradouro;

    private String complemento;

    @NotNull
    private String cep;

    private String bairro;

    @NotNull
    private String cidade;

    @NotNull
    private String estado;
}
