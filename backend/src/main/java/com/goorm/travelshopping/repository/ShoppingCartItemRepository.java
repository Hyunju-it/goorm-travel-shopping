package com.goorm.travelshopping.repository;

import com.goorm.travelshopping.entity.ShoppingCartItem;
import com.goorm.travelshopping.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, Long> {

    List<ShoppingCartItem> findByUser(User user);

    Optional<ShoppingCartItem> findByUserAndProductId(User user, Long productId);

    void deleteByUser(User user);
}
