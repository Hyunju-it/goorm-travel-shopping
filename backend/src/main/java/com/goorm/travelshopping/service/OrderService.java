package com.goorm.travelshopping.service;

import com.goorm.travelshopping.dto.order.OrderCreateRequest;
import com.goorm.travelshopping.dto.order.OrderDetailResponse;
import com.goorm.travelshopping.dto.order.OrderItemResponse;
import com.goorm.travelshopping.dto.order.OrderSummaryResponse;
import com.goorm.travelshopping.entity.Order;
import com.goorm.travelshopping.entity.OrderItem;
import com.goorm.travelshopping.entity.Product;
import com.goorm.travelshopping.entity.ShoppingCartItem;
import com.goorm.travelshopping.entity.User;
import com.goorm.travelshopping.entity.enums.OrderStatus;
import com.goorm.travelshopping.entity.enums.PaymentStatus;
import com.goorm.travelshopping.exception.BadRequestException;
import com.goorm.travelshopping.exception.ResourceNotFoundException;
import com.goorm.travelshopping.exception.UnauthorizedException;
import com.goorm.travelshopping.repository.OrderRepository;
import com.goorm.travelshopping.repository.ProductRepository;
import com.goorm.travelshopping.repository.ShoppingCartItemRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class OrderService {

    private static final DateTimeFormatter ORDER_NUMBER_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ShoppingCartItemRepository shoppingCartItemRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        ShoppingCartItemRepository shoppingCartItemRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.shoppingCartItemRepository = shoppingCartItemRepository;
    }

    public OrderDetailResponse createOrder(User user, OrderCreateRequest request) {
        Map<Long, OrderCreateRequest.OrderItemRequest> orderItemMap = request.items().stream()
                .collect(Collectors.toMap(OrderCreateRequest.OrderItemRequest::productId, item -> item));

        List<Product> products = productRepository.findAllById(orderItemMap.keySet());
        if (products.size() != orderItemMap.size()) {
            throw new BadRequestException("존재하지 않는 상품이 포함되어 있습니다.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(OrderStatus.ORDER_PLACED);
        order.setPaymentMethod(request.paymentMethod());
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setShippingName(request.shippingName());
        order.setShippingPhone(request.shippingPhone());
        order.setShippingAddress(request.shippingAddress());
        order.setOrderDate(LocalDateTime.now());

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal finalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (Product product : products) {
            OrderCreateRequest.OrderItemRequest itemRequest = orderItemMap.get(product.getId());
            int quantity = itemRequest.quantity();
            if (quantity <= 0) {
                throw new BadRequestException("수량은 1 이상이어야 합니다.");
            }

            if (product.getStockQuantity() < quantity) {
                throw new BadRequestException("재고가 부족한 상품이 있습니다: " + product.getName());
            }

            BigDecimal basePrice = product.getPrice();
            BigDecimal salesPrice = product.getEffectivePrice();
            BigDecimal itemTotal = basePrice.multiply(BigDecimal.valueOf(quantity));
            BigDecimal itemFinal = salesPrice.multiply(BigDecimal.valueOf(quantity));

            totalAmount = totalAmount.add(itemTotal);
            finalAmount = finalAmount.add(itemFinal);

            product.decreaseStock(quantity);

            OrderItem orderItem = new OrderItem();
            orderItem.assignOrder(order);
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setProductPrice(salesPrice);
            orderItem.setQuantity(quantity);
            orderItem.setSubtotal(itemFinal);
            orderItems.add(orderItem);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setFinalAmount(finalAmount);
        order.setDiscountAmount(totalAmount.subtract(finalAmount));

        orderRepository.save(order);

        List<ShoppingCartItem> cartItems = shoppingCartItemRepository.findByUser(user);
        List<ShoppingCartItem> toRemove = cartItems.stream()
                .filter(item -> orderItemMap.containsKey(item.getProduct().getId()))
                .toList();
        shoppingCartItemRepository.deleteAll(toRemove);

        return mapToDetailResponse(order);
    }

    @Transactional(value = jakarta.transaction.Transactional.TxType.SUPPORTS)
    public List<OrderSummaryResponse> getMyOrders(User user) {
        return orderRepository.findByUser(user).stream()
                .sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))
                .map(this::mapToSummaryResponse)
                .toList();
    }

    public List<OrderSummaryResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))
                .map(this::mapToSummaryResponse)
                .toList();
    }

    @Transactional(value = jakarta.transaction.Transactional.TxType.SUPPORTS)
    public OrderDetailResponse getOrderDetail(User user, String orderNumber) {
        Order order = orderRepository.findDetailByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("주문을 찾을 수 없습니다."));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("해당 주문에 접근할 수 없습니다.");
        }

        return mapToDetailResponse(order);
    }

    public void updateOrderStatus(String orderNumber, OrderStatus status, PaymentStatus paymentStatus) {
        if (status == null && paymentStatus == null) {
            throw new BadRequestException("변경할 상태 정보가 필요합니다.");
        }
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("주문을 찾을 수 없습니다."));
        if (status != null) {
            order.setStatus(status);
        }
        if (paymentStatus != null) {
            order.setPaymentStatus(paymentStatus);
        }
    }

    private String generateOrderNumber() {
        return "ORD" + LocalDateTime.now().format(ORDER_NUMBER_FORMATTER) + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private OrderDetailResponse mapToDetailResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProductName(),
                        item.getProductPrice(),
                        item.getQuantity(),
                        item.getSubtotal()
                ))
                .toList();

        return new OrderDetailResponse(
                order.getOrderNumber(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getTotalAmount(),
                order.getDiscountAmount(),
                order.getFinalAmount(),
                order.getShippingName(),
                order.getShippingPhone(),
                order.getShippingAddress(),
                order.getOrderDate(),
                itemResponses
        );
    }

    private OrderSummaryResponse mapToSummaryResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProductName(),
                        item.getProductPrice(),
                        item.getQuantity(),
                        item.getSubtotal()
                ))
                .toList();

        return new OrderSummaryResponse(
                order.getOrderNumber(),
                order.getStatus(),
                order.getFinalAmount(),
                order.getOrderDate(),
                itemResponses
        );
    }
}
