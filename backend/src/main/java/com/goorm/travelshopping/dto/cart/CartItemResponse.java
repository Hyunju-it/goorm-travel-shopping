package com.goorm.travelshopping.dto.cart;

import java.math.BigDecimal;

public record CartItemResponse(
        Long productId,
        String name,
        BigDecimal price,
        int quantity,
        String imageUrl,
        BigDecimal subtotal
) {
}
