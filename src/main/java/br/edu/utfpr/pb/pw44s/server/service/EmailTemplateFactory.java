package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.Order;
import org.springframework.stereotype.Component;

@Component
public class EmailTemplateFactory {

    public String buildOrderStatusTemplate(Order order) {

        return """
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color:#444;">Atualização do Pedido</h2>

                    <p>Olá!</p>
                    <p>Seu pedido <strong>#%s</strong> foi atualizado.</p>

                    <p><strong>Novo status:</strong> %s</p>

                    <br/>
                </div>
                """.formatted(
                order.getId(),
                order.getStatus().name().replace("_", " ")
        );
    }
}
