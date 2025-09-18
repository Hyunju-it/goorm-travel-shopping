package com.goorm.travelshopping.dto.product;

public record ProductImageResponse(
        Long id,
        String imageUrl,
        String altText,
        Integer sortOrder,
        Boolean main
) {
}
