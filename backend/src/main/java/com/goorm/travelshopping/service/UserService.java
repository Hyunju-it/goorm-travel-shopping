package com.goorm.travelshopping.service;

import com.goorm.travelshopping.dto.auth.RegisterRequest;
import com.goorm.travelshopping.dto.auth.UserResponse;
import com.goorm.travelshopping.entity.User;
import com.goorm.travelshopping.entity.enums.UserRole;
import com.goorm.travelshopping.entity.enums.UserStatus;
import com.goorm.travelshopping.exception.BadRequestException;
import com.goorm.travelshopping.exception.ResourceNotFoundException;
import com.goorm.travelshopping.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new BadRequestException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new BadRequestException("이미 등록된 이메일입니다.");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setName(request.name());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getRole());
    }

    public User getActiveUser(Long userId) {
        return userRepository.findById(userId)
                .filter(User::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
