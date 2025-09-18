package com.goorm.travelshopping.dto.product;

import com.goorm.travelshopping.entity.enums.ProductStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;

public record ProductUpdateRequest(
        @NotNull(message = "카테고리 ID는 필수입니다.")
        Long categoryId,

        @NotBlank(message = "상품명은 필수입니다.")
        String name,

        String shortDescription,
        String description,

        @NotNull(message = "상품 가격은 필수입니다.")
        @DecimalMin(value = "0.0", inclusive = false, message = "상품 가격은 0보다 커야 합니다.")
        BigDecimal price,

        @DecimalMin(value = "0.0", inclusive = false, message = "할인 가격은 0보다 커야 합니다.")
        BigDecimal salePrice,

        @NotNull(message = "재고 수량은 필수입니다.")
        @Positive(message = "재고 수량은 1 이상이어야 합니다.")
        Integer stockQuantity,

        String mainImageUrl,

        ProductStatus status,

        @Valid
        List<ProductImageRequest> images
) {
}
