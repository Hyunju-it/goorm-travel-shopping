package com.goorm.travelshopping.dto.order;

import com.goorm.travelshopping.entity.enums.OrderStatus;
import com.goorm.travelshopping.entity.enums.PaymentStatus;

public record UpdateOrderStatusRequest(
        OrderStatus status,
        PaymentStatus paymentStatus
) {
}
