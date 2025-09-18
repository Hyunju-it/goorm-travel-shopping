package com.goorm.travelshopping.dto.product;

import java.math.BigDecimal;

public record ProductSummaryResponse(
        Long id,
        String name,
        String shortDescription,
        BigDecimal price,
        BigDecimal salePrice,
        BigDecimal effectivePrice,
        String mainImageUrl,
        Long viewCount,
        BigDecimal ratingAverage,
        Long ratingCount
) {
}
