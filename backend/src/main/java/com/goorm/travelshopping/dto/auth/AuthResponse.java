package com.goorm.travelshopping.dto.auth;

public record AuthResponse(
        boolean success,
        String message,
        UserResponse user
) {
    public static AuthResponse success(UserResponse user) {
        return new AuthResponse(true, null, user);
    }

    public static AuthResponse failure(String message) {
        return new AuthResponse(false, message, null);
    }
}
