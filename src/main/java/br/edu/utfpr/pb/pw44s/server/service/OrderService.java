package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.OrderAttachmentRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderItemRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
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
import org.springframework.web.multipart.MultipartFile;
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

    private final OrderAttachmentRepository attachmentRepository;
    private final FileStorageService fileStorageService;

    private final EmailService emailService;
    private final EmailTemplateFactory templateFactory;
    private final UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            IAddressService addressService,
            @Lazy AuthService authService,
            ModelMapper modelMapper,
            OrderAttachmentRepository attachmentRepository,
            FileStorageService fileStorageService,
            EmailService emailService,
            EmailTemplateFactory templateFactory,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.addressService = addressService;
        this.authService = authService;
        this.attachmentRepository = attachmentRepository;
        this.fileStorageService = fileStorageService;
        this.modelMapper = modelMapper;
        this.emailService = emailService;
        this.templateFactory = templateFactory;
        this.userRepository = userRepository;
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

            orderItemRepository.save(orderItem);
            orderItems.add(orderItem);
        }

        savedOrder.setItems(orderItems);
        return savedOrder;
    }

    @Override
    public long countByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    @Override
    @Transactional
    public Order createOrder(OrderDTO orderDTO, Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = (User) authService.loadUserByUsername(userDetails.getUsername());

        Order order = new Order();
        order.setData(LocalDateTime.now());
        order.setUserId(user.getId());
        order.setStatus(OrderStatus.AGUARDANDO_PAGAMENTO);

        Address address;

        if (orderDTO.getAddressId() != null) {
            address = addressService.findOne(orderDTO.getAddressId());
            if (address == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Endereço não encontrado.");
            }
        } else if (orderDTO.getEnderecoManual() != null) {
            AddressDTO dto = orderDTO.getEnderecoManual();
            address = addressService.create(dto, authentication);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nenhum endereço fornecido.");
        }

        order.setAddress(address);

        return saveOrderWithItems(order, orderDTO.getItems());
    }

    @Transactional
    public OrderAttachment attachFile(Long orderId, MultipartFile file, AttachmentType type) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));

        String fileUrl = fileStorageService.saveOrderAttachment(file, orderId);

        OrderAttachment attachment = OrderAttachment.builder()
                .order(order)
                .fileName(file.getOriginalFilename())
                .fileUrl(fileUrl)
                .uploadedAt(LocalDateTime.now())
                .type(type)
                .build();

        return attachmentRepository.save(attachment);
    }

    @Override
    public List<OrderAttachment> listAttachments(Long orderId) {
        return attachmentRepository.findByOrderId(orderId);
    }

    @Transactional
    public void updateStatusAndNotify(Long orderId, OrderStatus newStatus) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Pedido não encontrado"));

        order.setStatus(newStatus);
        orderRepository.save(order);

        User user = userRepository.findById(order.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));


        String email = user.getEmail();
        // se o username for o e-mail

        String html = templateFactory.buildOrderStatusTemplate(order);

        // envia email simples
        emailService.sendHtml(email,
                "Seu pedido foi atualizado (#" + orderId + ")",
                html
        );
    }

}