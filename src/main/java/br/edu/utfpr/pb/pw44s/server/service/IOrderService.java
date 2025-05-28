package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface IOrderService extends ICrudService<Order, Long> {
    List<Order> findByUserId(Long userId);
    Order saveOrder(Order order);
    Order saveOrderWithItems(Order order, List<OrderItemDTO> items);
    Order createOrder(OrderDTO orderDTO, Authentication authentication);
}