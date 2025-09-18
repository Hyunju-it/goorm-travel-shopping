package com.goorm.travelshopping.repository;

import com.goorm.travelshopping.entity.Category;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByParentIsNullOrderBySortOrderAsc();
}
