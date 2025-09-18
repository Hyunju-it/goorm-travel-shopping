package com.goorm.travelshopping.dto.auth;

import com.goorm.travelshopping.entity.enums.UserRole;

public record UserResponse(
        Long id,
        String email,
        String name,
        UserRole role
) {
}
