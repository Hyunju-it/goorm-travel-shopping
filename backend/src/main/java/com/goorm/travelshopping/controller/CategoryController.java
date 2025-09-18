package com.goorm.travelshopping.controller;

import com.goorm.travelshopping.dto.product.CategoryResponse;
import com.goorm.travelshopping.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final ProductService productService;

    public CategoryController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<CategoryResponse> getCategories() {
        return productService.getCategories();
    }
}
