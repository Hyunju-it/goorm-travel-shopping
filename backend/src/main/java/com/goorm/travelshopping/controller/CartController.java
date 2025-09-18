package com.goorm.travelshopping.controller;

import com.goorm.travelshopping.dto.cart.AddCartItemRequest;
import com.goorm.travelshopping.dto.cart.CartResponse;
import com.goorm.travelshopping.dto.cart.UpdateCartItemRequest;
import com.goorm.travelshopping.security.CustomUserDetails;
import com.goorm.travelshopping.service.CartService;
import com.goorm.travelshopping.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    @GetMapping
    public CartResponse getCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return cartService.getCart(userService.getActiveUser(userDetails.getId()));
    }

    @PostMapping
    public CartResponse addToCart(@AuthenticationPrincipal CustomUserDetails userDetails,
                                  @Valid @RequestBody AddCartItemRequest request) {
        return cartService.addItem(userService.getActiveUser(userDetails.getId()), request);
    }

    @PutMapping("/{productId}")
    public CartResponse updateCartItem(@AuthenticationPrincipal CustomUserDetails userDetails,
                                       @PathVariable Long productId,
                                       @Valid @RequestBody UpdateCartItemRequest request) {
        return cartService.updateItem(userService.getActiveUser(userDetails.getId()), productId, request.quantity());
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeCartItem(@AuthenticationPrincipal CustomUserDetails userDetails,
                                               @PathVariable Long productId) {
        cartService.removeItem(userService.getActiveUser(userDetails.getId()), productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        cartService.clearCart(userService.getActiveUser(userDetails.getId()));
        return ResponseEntity.noContent().build();
    }
}
