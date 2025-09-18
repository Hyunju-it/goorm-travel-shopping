package com.goorm.travelshopping.dto.product;

import com.goorm.travelshopping.entity.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.List;

public record ProductDetailResponse(
        Long id,
        String name,
        String shortDescription,
        String description,
        BigDecimal price,
        BigDecimal salePrice,
        BigDecimal effectivePrice,
        Integer stockQuantity,
        String mainImageUrl,
        Long categoryId,
        String categoryName,
        ProductStatus status,
        List<ProductImageResponse> images,
        Long viewCount,
        BigDecimal ratingAverage,
        Long ratingCount
) {
}
