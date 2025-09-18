package com.goorm.travelshopping.dto.order;

import com.goorm.travelshopping.entity.enums.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrderCreateRequest(
        @NotBlank(message = "수령인 이름은 필수입니다.")
        String shippingName,

        @NotBlank(message = "수령인 연락처는 필수입니다.")
        String shippingPhone,

        @NotBlank(message = "배송지는 필수입니다.")
        String shippingAddress,

        @NotNull(message = "결제 수단은 필수입니다.")
        PaymentMethod paymentMethod,

        @NotEmpty(message = "주문 상품은 1개 이상이어야 합니다.")
        List<OrderItemRequest> items
) {
    public record OrderItemRequest(
            @NotNull(message = "상품 ID는 필수입니다.")
            Long productId,

            @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
            int quantity
    ) {
    }
}
