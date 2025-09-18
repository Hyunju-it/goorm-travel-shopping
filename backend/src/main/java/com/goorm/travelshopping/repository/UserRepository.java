package com.goorm.travelshopping.repository;

import com.goorm.travelshopping.entity.User;
import com.goorm.travelshopping.entity.enums.UserStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    long countByStatus(UserStatus status);
}
