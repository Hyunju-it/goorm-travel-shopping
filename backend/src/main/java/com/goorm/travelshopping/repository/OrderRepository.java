package com.goorm.travelshopping.repository;

import com.goorm.travelshopping.entity.Order;
import com.goorm.travelshopping.entity.User;
import com.goorm.travelshopping.entity.enums.OrderStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product WHERE o.orderNumber = :orderNumber")
    Optional<Order> findDetailByOrderNumber(@Param("orderNumber") String orderNumber);

    List<Order> findByUser(User user);

    long countByStatus(OrderStatus status);
}
