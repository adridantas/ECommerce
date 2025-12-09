package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderAttachmentDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDashboardDTO;
import br.edu.utfpr.pb.pw44s.server.model.AttachmentType;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderAttachment;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class OrderAdminController {

    private final IOrderService orderService;
    private final ModelMapper mapper;

    public OrderAdminController(IOrderService orderService, ModelMapper mapper) {
        this.orderService = orderService;
        this.mapper = mapper;
    }

    @GetMapping
    public List<OrderDTO> findAll() {
        return orderService.findAll().stream()
                .map(order -> mapper.map(order, OrderDTO.class))
                .toList();
    }

    @GetMapping("/dashboard")
    public OrderDashboardDTO dashboard() {
        return new OrderDashboardDTO(
                orderService.countByStatus(OrderStatus.AGUARDANDO_PAGAMENTO),
                orderService.countByStatus(OrderStatus.PAGO),
                orderService.countByStatus(OrderStatus.EM_TRANSPORTE),
                orderService.countByStatus(OrderStatus.ENTREGUE),
                orderService.countByStatus(OrderStatus.CANCELADO)
        );
    }
    @PostMapping("/{id}/attachments")
    public ResponseEntity<?> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") AttachmentType type
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Arquivo vazio");
        }

        OrderAttachment attachment = orderService.attachFile(id, file, type);

        return ResponseEntity.ok("Arquivo anexado com sucesso ID: " + attachment.getId());
    }
    @GetMapping("/{id}/attachments")
    public List<OrderAttachmentDTO> listAttachments(@PathVariable Long id) {
        return orderService.listAttachments(id).stream()
                .map(a -> mapper.map(a, OrderAttachmentDTO.class))
                .toList();
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        orderService.updateStatusAndNotify(id, status);
        return ResponseEntity.ok("Status atualizado e email enviado");
    }


}
