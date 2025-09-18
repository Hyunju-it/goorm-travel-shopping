package com.goorm.travelshopping.dto.cart;

import jakarta.validation.constraints.Min;

public record UpdateCartItemRequest(
        @Min(value = 0, message = "수량은 0 이상이어야 합니다.")
        int quantity
) {
}
