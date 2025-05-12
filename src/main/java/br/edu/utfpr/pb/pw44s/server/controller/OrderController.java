package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("orders")
public class OrderController {

    private final IOrderService orderService;
    private final ModelMapper modelMapper;
    private final AuthService authService;
    private final IAddressService addressService;



    @PersistenceContext
    private EntityManager entityManager;

    public OrderController(IOrderService orderService , ModelMapper modelMapper, AuthService authService, IAddressService addressService) {
        this.orderService = orderService;
        this.modelMapper = modelMapper;
        this.authService = authService;
        this.addressService = addressService;

    }

    @PostMapping
    @Transactional
    public ResponseEntity<OrderDTO> createOrder(@RequestBody @Valid OrderDTO orderDTO) {
        Order order = modelMapper.map(orderDTO, Order.class);
        order.setData(LocalDateTime.now());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            User user = (User) authService.loadUserByUsername(username);
            order.setUserId(user.getId());

            Address address = addressService.findOne(orderDTO.getAddressId());
            if (address == null) {
                return ResponseEntity.badRequest().body(null);
            }
            order.setAddress(address);
            order.setItems(new ArrayList<>());

            Order savedOrder = orderService.saveOrder(order);

            List<OrderItem> orderItems = orderDTO.getItems().stream()
                    .map(itemDTO -> {
                        Product product = entityManager.find(Product.class, itemDTO.getProductId());
                        if (product == null) {
                            return null;
                        }

                        OrderItem orderItem;
                        if (itemDTO.getId() != null) {
                            orderItem = entityManager.find(OrderItem.class, itemDTO.getId());
                            if (orderItem == null) {
                                throw new EntityNotFoundException("OrderItem com ID " + itemDTO.getId() + " não encontrado.");
                            }
                        } else {
                            orderItem = new OrderItem();
                        }

                        orderItem.setOrder(savedOrder);
                        orderItem.setProduct(product);
                        orderItem.setPreco(product.getPrice());
                        orderItem.setQuantidade(itemDTO.getQuantidade());

                        entityManager.persist(orderItem);
                        return orderItem;
                    })
                    .collect(Collectors.toList());

            if (orderItems.contains(null)) {
                return ResponseEntity.badRequest().build();
            }

            savedOrder.setItems(orderItems);
            return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(savedOrder, OrderDTO.class));

        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> listUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.findByUserId(userId);
        List<OrderDTO> orderDTOs = orders.stream()
                .map(order -> {
                    OrderDTO dto = modelMapper.map(order, OrderDTO.class);
                    dto.setItems(order.getItems().stream()
                            .map(item -> modelMapper.map(item, OrderItemDTO.class))
                            .collect(Collectors.toList()));
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> findOrderById(@PathVariable Long id) {
        Order order = orderService.findOne(id);
        if (order != null) {
            OrderDTO dto = modelMapper.map(order, OrderDTO.class);
            dto.setItems(order.getItems().stream()
                    .map(item -> {
                        OrderItemDTO itemDTO = modelMapper.map(item, OrderItemDTO.class);
                        itemDTO.setProductId(item.getProduct().getId());
                        return itemDTO;
                    })
                    .collect(Collectors.toList()));
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}