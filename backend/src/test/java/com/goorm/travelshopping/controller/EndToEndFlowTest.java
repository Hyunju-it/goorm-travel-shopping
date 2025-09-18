package com.goorm.travelshopping.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.goorm.travelshopping.dto.cart.AddCartItemRequest;
import com.goorm.travelshopping.dto.cart.CartResponse;
import com.goorm.travelshopping.dto.order.OrderCreateRequest;
import com.goorm.travelshopping.dto.order.OrderDetailResponse;
import com.goorm.travelshopping.dto.order.OrderSummaryResponse;
import com.goorm.travelshopping.entity.Category;
import com.goorm.travelshopping.entity.Product;
import com.goorm.travelshopping.entity.User;
import com.goorm.travelshopping.entity.enums.CategoryStatus;
import com.goorm.travelshopping.entity.enums.OrderStatus;
import com.goorm.travelshopping.entity.enums.PaymentMethod;
import com.goorm.travelshopping.entity.enums.PaymentStatus;
import com.goorm.travelshopping.entity.enums.ProductStatus;
import com.goorm.travelshopping.entity.enums.UserRole;
import com.goorm.travelshopping.entity.enums.UserStatus;
import com.goorm.travelshopping.repository.CategoryRepository;
import com.goorm.travelshopping.repository.ProductRepository;
import com.goorm.travelshopping.repository.UserRepository;
import com.goorm.travelshopping.service.CartService;
import com.goorm.travelshopping.service.OrderService;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class EndToEndFlowTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Long productId;
    private User user;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        Category category = new Category();
        category.setName("통합 카테고리");
        category.setDescription("통합 테스트용 카테고리");
        category.setSortOrder(1);
        category.setStatus(CategoryStatus.ACTIVE);
        Category savedCategory = categoryRepository.save(category);

        Product product = new Product();
        product.setCategory(savedCategory);
        product.setName("통합 테스트 상품");
        product.setShortDescription("테스트용 짧은 설명");
        product.setDescription("테스트용 상세 설명");
        product.setPrice(BigDecimal.valueOf(150000));
        product.setSalePrice(BigDecimal.valueOf(120000));
        product.setStockQuantity(50);
        product.setMainImageUrl("http://example.com/product.jpg");
        product.setStatus(ProductStatus.ACTIVE);
        product.setViewCount(0L);
        product.setRatingAverage(null);
        product.setRatingCount(null);
        Product savedProduct = productRepository.save(product);
        this.productId = savedProduct.getId();

        user = new User();
        user.setEmail("flow-user@example.com");
        user.setPassword(passwordEncoder.encode("TestPass1!"));
        user.setName("통합 이용자");
        user.setPhone("010-1111-2222");
        user.setAddress("서울시 테스트구 123");
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    @Test
    @DisplayName("회원의 장바구니 담기부터 주문 생성까지 전 과정을 검증한다")
    void completeShoppingFlow() {
        CartResponse cartResponse = cartService.addItem(user, new AddCartItemRequest(productId, 2));
        assertEquals(2, cartResponse.totalQuantity());
        assertThat(cartResponse.items()).hasSize(1);

        OrderCreateRequest orderRequest = new OrderCreateRequest(
                "통합 이용자",
                "010-1111-2222",
                "서울시 테스트구 123",
                PaymentMethod.CARD,
                List.of(new OrderCreateRequest.OrderItemRequest(productId, 2))
        );

        OrderDetailResponse orderDetail = orderService.createOrder(user, orderRequest);
        assertThat(orderDetail.orderNumber()).isNotBlank();
        assertEquals(OrderStatus.ORDER_PLACED, orderDetail.status());
        assertEquals(PaymentMethod.CARD, orderDetail.paymentMethod());
        assertEquals(PaymentStatus.PENDING, orderDetail.paymentStatus());
        assertEquals(2, orderDetail.items().get(0).quantity());

        List<OrderSummaryResponse> summaries = orderService.getMyOrders(user);
        assertThat(summaries).hasSize(1);
        assertEquals(orderDetail.orderNumber(), summaries.get(0).orderNumber());
    }
}
