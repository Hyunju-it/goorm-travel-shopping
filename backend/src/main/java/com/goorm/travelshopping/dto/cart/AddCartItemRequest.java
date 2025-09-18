package com.goorm.travelshopping.dto.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddCartItemRequest(
        @NotNull(message = "상품 ID는 필수입니다.")
        Long productId,

        @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
        int quantity
) {
}
