package com.goorm.travelshopping.controller;

import com.goorm.travelshopping.dto.product.ProductDetailResponse;
import com.goorm.travelshopping.dto.product.ProductSummaryResponse;
import com.goorm.travelshopping.service.ProductService;
import jakarta.validation.constraints.Min;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@Validated
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductSummaryResponse> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) @Min(value = 1, message = "카테고리 ID는 1 이상이어야 합니다.") Long categoryId
    ) {
        return productService.getProducts(keyword, categoryId);
    }

    @GetMapping("/{productId}")
    public ProductDetailResponse getProductDetail(@PathVariable Long productId) {
        return productService.increaseViewAndGetDetail(productId);
    }
}
