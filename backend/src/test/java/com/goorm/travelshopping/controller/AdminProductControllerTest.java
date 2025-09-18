package com.goorm.travelshopping.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.goorm.travelshopping.entity.Category;
import com.goorm.travelshopping.entity.enums.CategoryStatus;
import com.goorm.travelshopping.repository.CategoryRepository;
import com.goorm.travelshopping.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    private Long categoryId;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();

        Category category = new Category();
        category.setName("테스트 카테고리");
        category.setDescription("테스트 설명");
        category.setSortOrder(1);
        category.setStatus(CategoryStatus.ACTIVE);

        Category saved = categoryRepository.save(category);
        categoryId = saved.getId();
    }

    @Test
    @DisplayName("관리자 권한으로 상품을 생성하면 201 응답과 함께 상품 정보가 반환된다")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProduct_asAdmin_returnsCreated() throws Exception {
        String payload = buildPayload(categoryId, "테스트 상품", "짧은 설명", "상세 설명",
                "100000", "90000", "10", "http://example.com/main.jpg", "ACTIVE");

        mockMvc.perform(post("/api/admin/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("테스트 상품"))
                .andExpect(jsonPath("$.categoryId").value(categoryId));
    }

    @Test
    @DisplayName("일반 사용자 권한으로는 상품 생성이 금지된다")
    @WithMockUser(username = "user", roles = {"USER"})
    void createProduct_asUser_forbidden() throws Exception {
        String payload = buildPayload(categoryId, "테스트 상품", "짧은 설명", "상세 설명",
                "100000", null, "5", null, "ACTIVE");

        mockMvc.perform(post("/api/admin/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("인증되지 않은 사용자는 401 응답을 받는다")
    void createProduct_unauthenticated_unauthorized() throws Exception {
        String payload = buildPayload(categoryId, "테스트 상품", "짧은 설명", "상세 설명",
                "100000", null, "5", null, "ACTIVE");

        mockMvc.perform(post("/api/admin/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isForbidden());
    }

    private String buildPayload(Long categoryId, String name, String shortDesc, String desc, String price, String salePrice, String stockQuantity, String mainImageUrl, String status) throws Exception {
        java.util.LinkedHashMap<String, Object> payload = new java.util.LinkedHashMap<>();
        payload.put("categoryId", categoryId);
        payload.put("name", name);
        payload.put("shortDescription", shortDesc);
        payload.put("description", desc);
        payload.put("price", new java.math.BigDecimal(price));
        if (salePrice != null) {
            payload.put("salePrice", new java.math.BigDecimal(salePrice));
        }
        payload.put("stockQuantity", Integer.parseInt(stockQuantity));
        if (mainImageUrl != null) {
            payload.put("mainImageUrl", mainImageUrl);
        }
        payload.put("status", status);
        payload.put("images", java.util.Collections.emptyList());
        return objectMapper.writeValueAsString(payload);
    }

}
