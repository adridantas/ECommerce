package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.model.AttachmentType;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderAttachment;
import br.edu.utfpr.pb.pw44s.server.model.OrderStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IOrderService extends ICrudService<Order, Long> {
    List<Order> findByUserId(Long userId);
    Order saveOrder(Order order);
    Order saveOrderWithItems(Order order, List<OrderItemDTO> items);
    long countByStatus(OrderStatus status);
    OrderAttachment attachFile(Long orderId, MultipartFile file, AttachmentType type);
    List<OrderAttachment> listAttachments(Long orderId);
    void updateStatusAndNotify(Long orderId, OrderStatus status);

    default Order createOrder(OrderDTO orderDTO, Authentication authentication) {
        return null;
    }
}