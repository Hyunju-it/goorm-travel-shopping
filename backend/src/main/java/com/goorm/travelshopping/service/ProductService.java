package com.goorm.travelshopping.service;

import com.goorm.travelshopping.dto.product.CategoryResponse;
import com.goorm.travelshopping.dto.product.ProductCreateRequest;
import com.goorm.travelshopping.dto.product.ProductDetailResponse;
import com.goorm.travelshopping.dto.product.ProductImageRequest;
import com.goorm.travelshopping.dto.product.ProductImageResponse;
import com.goorm.travelshopping.dto.product.ProductSummaryResponse;
import com.goorm.travelshopping.dto.product.ProductUpdateRequest;
import com.goorm.travelshopping.entity.Category;
import com.goorm.travelshopping.entity.Product;
import com.goorm.travelshopping.entity.ProductImage;
import com.goorm.travelshopping.entity.enums.ProductStatus;
import com.goorm.travelshopping.exception.BadRequestException;
import com.goorm.travelshopping.exception.ResourceNotFoundException;
import com.goorm.travelshopping.repository.CategoryRepository;
import com.goorm.travelshopping.repository.ProductRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public ProductDetailResponse increaseViewAndGetDetail(Long productId) {
        Product product = productRepository.findWithCategory(productId)
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다."));

        product.increaseViewCount();
        return mapToDetail(product);
    }

    @Transactional(value = jakarta.transaction.Transactional.TxType.SUPPORTS)
    public List<ProductSummaryResponse> getProducts(String keyword, Long categoryId) {
        List<Product> products = productRepository.findByStatus(ProductStatus.ACTIVE);

        return products.stream()
                .filter(product -> matchesCategory(product, categoryId))
                .filter(product -> matchesKeyword(product, keyword))
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed())
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(value = jakarta.transaction.Transactional.TxType.SUPPORTS)
    public List<CategoryResponse> getCategories() {
        List<Category> roots = categoryRepository.findAllByParentIsNullOrderBySortOrderAsc();
        return roots.stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    private boolean matchesCategory(Product product, Long categoryId) {
        if (categoryId == null) {
            return true;
        }
        Category category = product.getCategory();
        while (category != null) {
            if (Objects.equals(category.getId(), categoryId)) {
                return true;
            }
            category = category.getParent();
        }
        return false;
    }

    private boolean matchesKeyword(Product product, String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return true;
        }
        String lowerKeyword = keyword.toLowerCase();
        return product.getName().toLowerCase().contains(lowerKeyword)
                || (product.getShortDescription() != null
                && product.getShortDescription().toLowerCase().contains(lowerKeyword))
                || (product.getDescription() != null
                && product.getDescription().toLowerCase().contains(lowerKeyword));
    }

    private ProductSummaryResponse mapToSummary(Product product) {
        return new ProductSummaryResponse(
                product.getId(),
                product.getName(),
                product.getShortDescription(),
                product.getPrice(),
                product.getSalePrice(),
                product.getEffectivePrice(),
                product.getMainImageUrl(),
                product.getViewCount(),
                product.getRatingAverage(),
                product.getRatingCount()
        );
    }

    private ProductDetailResponse mapToDetail(Product product) {
        List<ProductImageResponse> images = product.getImages().stream()
                .sorted(Comparator.comparing(image -> image.getSortOrder() == null ? Integer.MAX_VALUE : image.getSortOrder()))
                .map(this::mapToImageResponse)
                .collect(Collectors.toList());

        return new ProductDetailResponse(
                product.getId(),
                product.getName(),
                product.getShortDescription(),
                product.getDescription(),
                product.getPrice(),
                product.getSalePrice(),
                product.getEffectivePrice(),
                product.getStockQuantity(),
                product.getMainImageUrl(),
                product.getCategory() != null ? product.getCategory().getId() : null,
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getStatus(),
                images,
                product.getViewCount(),
                product.getRatingAverage(),
                product.getRatingCount()
        );
    }

    private ProductImageResponse mapToImageResponse(ProductImage image) {
        return new ProductImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getAltText(),
                image.getSortOrder(),
                image.getMain()
        );
    }

    private CategoryResponse mapToCategoryResponse(Category category) {
        List<CategoryResponse> children = category.getChildren().stream()
                .sorted(Comparator.comparing(child -> child.getSortOrder() == null ? Integer.MAX_VALUE : child.getSortOrder()))
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getSortOrder(),
                category.getStatus().name(),
                children
        );
    }

    @Transactional
    public ProductDetailResponse createProduct(ProductCreateRequest request) {
        Category category = getCategoryOrThrow(request.categoryId());
        validateSalePrice(request.price(), request.salePrice());

        Product product = new Product();
        product.setCategory(category);
        product.setName(request.name());
        product.setShortDescription(request.shortDescription());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setSalePrice(request.salePrice());
        product.setStockQuantity(request.stockQuantity());
        product.setMainImageUrl(request.mainImageUrl());
        product.setStatus(request.status() != null ? request.status() : ProductStatus.ACTIVE);
        product.setViewCount(0L);
        product.setRatingAverage(null);
        product.setRatingCount(null);

        applyImages(product, request.images());

        Product saved = productRepository.save(product);
        return mapToDetail(saved);
    }

    @Transactional
    public ProductDetailResponse updateProduct(Long productId, ProductUpdateRequest request) {
        Product product = productRepository.findWithCategory(productId)
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다."));

        Category category = getCategoryOrThrow(request.categoryId());
        validateSalePrice(request.price(), request.salePrice());

        product.setCategory(category);
        product.setName(request.name());
        product.setShortDescription(request.shortDescription());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setSalePrice(request.salePrice());
        product.setStockQuantity(request.stockQuantity());
        product.setMainImageUrl(request.mainImageUrl());
        if (request.status() != null) {
            product.setStatus(request.status());
        }

        applyImages(product, request.images());

        return mapToDetail(product);
    }


    @Transactional(value = jakarta.transaction.Transactional.TxType.SUPPORTS)
    public ProductDetailResponse getProductDetail(Long productId) {
        Product product = productRepository.findWithCategory(productId)
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다."));
        return mapToDetail(product);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다."));
        productRepository.delete(product);
    }

    @Transactional(value = jakarta.transaction.Transactional.TxType.SUPPORTS)
    public List<ProductDetailResponse> getProductsForAdmin(ProductStatus status) {
        List<Product> products = status != null ? productRepository.findByStatus(status) : productRepository.findAll();

        return products.stream()
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed())
                .map(this::mapToDetail)
                .collect(Collectors.toList());
    }

    private Category getCategoryOrThrow(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("카테고리를 찾을 수 없습니다."));
    }

    private void validateSalePrice(java.math.BigDecimal price, java.math.BigDecimal salePrice) {
        if (salePrice != null && price != null && salePrice.compareTo(price) > 0) {
            throw new BadRequestException("할인 가격은 정가보다 클 수 없습니다.");
        }
    }

    private void applyImages(Product product, List<ProductImageRequest> imageRequests) {
        if (product.getImages() == null) {
            product.setImages(new ArrayList<>());
        } else {
            product.getImages().clear();
        }

        if (imageRequests == null || imageRequests.isEmpty()) {
            return;
        }

        for (ProductImageRequest imageRequest : imageRequests) {
            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setImageUrl(imageRequest.imageUrl());
            image.setAltText(imageRequest.altText());
            image.setSortOrder(imageRequest.sortOrder());
            image.setMain(imageRequest.main());
            product.getImages().add(image);
        }
    }

}