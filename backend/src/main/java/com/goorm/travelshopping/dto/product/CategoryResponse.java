package com.goorm.travelshopping.dto.product;

import java.util.List;

public record CategoryResponse(
        Long id,
        String name,
        String description,
        Integer sortOrder,
        String status,
        List<CategoryResponse> children
) {
}
