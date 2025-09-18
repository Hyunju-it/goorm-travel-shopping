package com.goorm.travelshopping.dto.order;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long productId,
        String productName,
        BigDecimal productPrice,
        int quantity,
        BigDecimal subtotal
) {
}
