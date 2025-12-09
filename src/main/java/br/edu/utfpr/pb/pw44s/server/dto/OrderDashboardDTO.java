package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDashboardDTO {

    private long aguardandoPagamento;
    private long pago;
    private long emTransporte;
    private long entregue;
    private long cancelado;

}
