package com.goorm.travelshopping.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public record ProductImageRequest(
        @NotBlank(message = "이미지 URL은 필수입니다.")
        String imageUrl,
        String altText,
        @PositiveOrZero(message = "정렬 순서는 0 이상이어야 합니다.")
        Integer sortOrder,
        Boolean main
) {
}
