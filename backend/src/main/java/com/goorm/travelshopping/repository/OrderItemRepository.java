package com.goorm.travelshopping.repository;

import com.goorm.travelshopping.entity.Order;
import com.goorm.travelshopping.entity.OrderItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(Order order);
}
