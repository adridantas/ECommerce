package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.OrderItemRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.service.impl.CrudServiceImpl;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService extends CrudServiceImpl<Order, Long> implements IOrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final IAddressService addressService;
    private final AuthService authService;
    private final ModelMapper modelMapper;

    @PersistenceContext
    private EntityManager entityManager;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository, IAddressService addressService, @Lazy AuthService authService, ModelMapper modelMapper) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.addressService = addressService;
        this.authService = authService;
        this.modelMapper = modelMapper;
    }

    @Override
    protected JpaRepository<Order, Long> getRepository() {
        return this.orderRepository;
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order saveOrderWithItems(Order order, List<OrderItemDTO> items) {
        Order savedOrder = orderRepository.save(order);
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemDTO itemDTO : items) {
            Product product = entityManager.find(Product.class, itemDTO.getProductId());
            if (product == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Produto com ID " + itemDTO.getProductId() + " não encontrado.");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setPreco(product.getPrice());
            orderItem.setQuantidade(itemDTO.getQuantidade());

            System.out.println("Salvando OrderItem:");
            System.out.println("  Order ID: " + savedOrder.getId());
            System.out.println("  Product ID: " + product.getId());
            System.out.println("  Preço: " + orderItem.getPreco());
            System.out.println("  Quantidade: " + orderItem.getQuantidade());

            orderItemRepository.save(orderItem);
            orderItems.add(orderItem);
        }

        savedOrder.setItems(orderItems);
        return savedOrder;
    }

    @Override
    @Transactional
    public Order createOrder(OrderDTO orderDTO, Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();

            Order order = modelMapper.map(orderDTO, Order.class);
            order.setData(LocalDateTime.now());

            User user = (User) authService.loadUserByUsername(username);
            order.setUserId(user.getId());

            Address address = addressService.findOne(orderDTO.getAddressId());
            if (address == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Endereço com ID " + orderDTO.getAddressId() + " não encontrado.");
            }
            order.setAddress(address);

            return saveOrderWithItems(order, orderDTO.getItems());
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado.");
        }
    }
}