package com.goorm.travelshopping.service;

import com.goorm.travelshopping.dto.cart.AddCartItemRequest;
import com.goorm.travelshopping.dto.cart.CartItemResponse;
import com.goorm.travelshopping.dto.cart.CartResponse;
import com.goorm.travelshopping.entity.Product;
import com.goorm.travelshopping.entity.ShoppingCartItem;
import com.goorm.travelshopping.entity.User;
import com.goorm.travelshopping.entity.enums.ProductStatus;
import com.goorm.travelshopping.exception.BadRequestException;
import com.goorm.travelshopping.exception.ResourceNotFoundException;
import com.goorm.travelshopping.repository.ProductRepository;
import com.goorm.travelshopping.repository.ShoppingCartItemRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class CartService {

    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final ProductRepository productRepository;

    public CartService(ShoppingCartItemRepository shoppingCartItemRepository, ProductRepository productRepository) {
        this.shoppingCartItemRepository = shoppingCartItemRepository;
        this.productRepository = productRepository;
    }

    public CartResponse getCart(User user) {
        List<ShoppingCartItem> items = shoppingCartItemRepository.findByUser(user);
        return mapToCartResponse(items);
    }

    public CartResponse addItem(User user, AddCartItemRequest request) {
        Product product = validateProduct(request.productId());
        ShoppingCartItem item = shoppingCartItemRepository.findByUserAndProductId(user, product.getId())
                .map(existing -> {
                    int newQuantity = existing.getQuantity() + request.quantity();
                    validateStock(product, newQuantity);
                    existing.setQuantity(newQuantity);
                    return existing;
                })
                .orElseGet(() -> createCartItem(user, product, request.quantity()));

        shoppingCartItemRepository.save(item);
        return getCart(user);
    }

    public CartResponse updateItem(User user, Long productId, int quantity) {
        ShoppingCartItem item = shoppingCartItemRepository.findByUserAndProductId(user, productId)
                .orElseThrow(() -> new ResourceNotFoundException("장바구니에 해당 상품이 없습니다."));

        if (quantity <= 0) {
            shoppingCartItemRepository.delete(item);
            return getCart(user);
        }

        validateStock(item.getProduct(), quantity);
        item.setQuantity(quantity);
        shoppingCartItemRepository.save(item);
        return getCart(user);
    }

    public void removeItem(User user, Long productId) {
        shoppingCartItemRepository.findByUserAndProductId(user, productId)
                .ifPresent(shoppingCartItemRepository::delete);
    }

    public void clearCart(User user) {
        shoppingCartItemRepository.deleteByUser(user);
    }

    private ShoppingCartItem createCartItem(User user, Product product, int quantity) {
        validateStock(product, quantity);
        ShoppingCartItem cartItem = new ShoppingCartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        return cartItem;
    }

    private Product validateProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다."));

        if (!ProductStatus.ACTIVE.equals(product.getStatus())) {
            throw new BadRequestException("판매 중이 아닌 상품입니다.");
        }
        return product;
    }

    private void validateStock(Product product, int requested) {
        if (requested > product.getStockQuantity()) {
            throw new BadRequestException("재고가 부족합니다.");
        }
    }

    private CartResponse mapToCartResponse(List<ShoppingCartItem> items) {
        List<CartItemResponse> itemResponses = items.stream()
                .map(item -> new CartItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getEffectivePrice(),
                        item.getQuantity(),
                        item.getProduct().getMainImageUrl(),
                        item.getProduct().getEffectivePrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                ))
                .toList();

        int totalQuantity = itemResponses.stream().mapToInt(CartItemResponse::quantity).sum();
        BigDecimal totalAmount = itemResponses.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(itemResponses, totalQuantity, totalAmount);
    }
}
