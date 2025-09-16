# 데이터베이스 설계서 (Database Design Document)

## 📋 문서 정보
- **프로젝트명**: 통합 여행 쇼핑몰
- **DB 엔진**: MySQL 8.0
- **문자셋**: UTF-8 (utf8mb4)
- **작성일**: 2025-09-16
- **버전**: 1.0

---

## 🎯 설계 원칙

### 1. 정규화
- **제3정규화** 적용으로 데이터 무결성 보장
- 중복 데이터 최소화
- 참조 무결성 제약 조건 적용

### 2. 성능 고려사항
- 적절한 인덱스 설계
- 조회 성능 최적화를 위한 비정규화 고려
- 대용량 데이터 처리를 위한 파티셔닝 준비

### 3. 확장성
- 향후 기능 확장을 고려한 유연한 스키마 설계
- 소프트 삭제(Soft Delete) 패턴 적용
- 감사(Audit) 컬럼 표준화

---

## 📊 전체 ERD 개요

```
[Users] ──────┐
      │       │
      │   ┌───▼────┐
      │   │ Orders │
      │   └───┬────┘
      │       │
      │   ┌───▼──────────┐
      │   │ Order_Items  │
      │   └───┬──────────┘
      │       │
   ┌──▼───────▼──┐
   │  Products   │
   └─────────────┘
```

---

## 🗃 테이블 상세 설계

### 1. Users (사용자)

**테이블명**: `users`
**설명**: 시스템 사용자 정보를 저장하는 테이블

| 컬럼명 | 데이터 타입 | 제약 조건 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | BIGINT | PK, AUTO_INCREMENT | - | 사용자 고유 ID |
| email | VARCHAR(100) | UNIQUE, NOT NULL | - | 이메일 (로그인 ID) |
| password | VARCHAR(255) | NOT NULL | - | 암호화된 비밀번호 |
| name | VARCHAR(50) | NOT NULL | - | 사용자 이름 |
| phone | VARCHAR(20) | NULL | - | 전화번호 |
| address | TEXT | NULL | - | 주소 |
| role | ENUM('USER', 'ADMIN') | NOT NULL | 'USER' | 사용자 권한 |
| status | ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') | NOT NULL | 'ACTIVE' | 계정 상태 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP ON UPDATE | 수정일시 |
| deleted_at | TIMESTAMP | NULL | NULL | 삭제일시 (Soft Delete) |

#### 인덱스
```sql
-- 기본 인덱스
PRIMARY KEY (id)
UNIQUE KEY uk_users_email (email)

-- 성능 인덱스
INDEX idx_users_status (status)
INDEX idx_users_created_at (created_at)
INDEX idx_users_deleted_at (deleted_at)
```

#### 제약 조건
```sql
-- 이메일 형식 검증
CONSTRAINT chk_users_email_format
CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')

-- 전화번호 형식 검증 (선택적)
CONSTRAINT chk_users_phone_format
CHECK (phone IS NULL OR phone REGEXP '^[0-9-+() ]+$')
```

---

### 2. Categories (카테고리)

**테이블명**: `categories`
**설명**: 상품 카테고리 분류 정보

| 컬럼명 | 데이터 타입 | 제약 조건 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | BIGINT | PK, AUTO_INCREMENT | - | 카테고리 ID |
| name | VARCHAR(100) | NOT NULL | - | 카테고리명 |
| description | TEXT | NULL | - | 카테고리 설명 |
| parent_id | BIGINT | FK, NULL | NULL | 상위 카테고리 ID |
| sort_order | INT | NOT NULL | 0 | 정렬 순서 |
| status | ENUM('ACTIVE', 'INACTIVE') | NOT NULL | 'ACTIVE' | 카테고리 상태 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP ON UPDATE | 수정일시 |

#### 인덱스
```sql
PRIMARY KEY (id)
INDEX idx_categories_parent_id (parent_id)
INDEX idx_categories_status (status)
INDEX idx_categories_sort_order (sort_order)
```

---

### 3. Products (상품)

**테이블명**: `products`
**설명**: 여행 상품 정보를 저장하는 테이블

| 컬럼명 | 데이터 타입 | 제약 조건 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | BIGINT | PK, AUTO_INCREMENT | - | 상품 고유 ID |
| category_id | BIGINT | FK, NOT NULL | - | 카테고리 ID |
| name | VARCHAR(200) | NOT NULL | - | 상품명 |
| description | TEXT | NULL | - | 상품 상세 설명 |
| short_description | VARCHAR(500) | NULL | - | 상품 요약 설명 |
| price | DECIMAL(12,2) | NOT NULL | - | 상품 가격 |
| sale_price | DECIMAL(12,2) | NULL | - | 할인 가격 |
| stock_quantity | INT | NOT NULL | 0 | 재고 수량 |
| main_image_url | VARCHAR(500) | NULL | - | 대표 이미지 URL |
| status | ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK') | NOT NULL | 'ACTIVE' | 상품 상태 |
| view_count | BIGINT | NOT NULL | 0 | 조회수 |
| rating_avg | DECIMAL(3,2) | NOT NULL | 0.00 | 평균 평점 |
| rating_count | INT | NOT NULL | 0 | 평점 개수 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP ON UPDATE | 수정일시 |
| deleted_at | TIMESTAMP | NULL | NULL | 삭제일시 (Soft Delete) |

#### 인덱스
```sql
PRIMARY KEY (id)
INDEX idx_products_category_id (category_id)
INDEX idx_products_status (status)
INDEX idx_products_price (price)
INDEX idx_products_created_at (created_at)
INDEX idx_products_view_count (view_count)
INDEX idx_products_rating_avg (rating_avg)
INDEX idx_products_deleted_at (deleted_at)

-- 복합 인덱스
INDEX idx_products_category_status (category_id, status)
INDEX idx_products_status_price (status, price)
```

#### 제약 조건
```sql
-- 가격 검증
CONSTRAINT chk_products_price_positive CHECK (price >= 0)
CONSTRAINT chk_products_sale_price_valid
CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price <= price))

-- 재고 검증
CONSTRAINT chk_products_stock_non_negative CHECK (stock_quantity >= 0)

-- 평점 검증
CONSTRAINT chk_products_rating_range CHECK (rating_avg BETWEEN 0.00 AND 5.00)
CONSTRAINT chk_products_rating_count_non_negative CHECK (rating_count >= 0)
```

---

### 4. Product_Images (상품 이미지)

**테이블명**: `product_images`
**설명**: 상품별 다중 이미지 정보

| 컬럼명 | 데이터 타입 | 제약 조건 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | BIGINT | PK, AUTO_INCREMENT | - | 이미지 ID |
| product_id | BIGINT | FK, NOT NULL | - | 상품 ID |
| image_url | VARCHAR(500) | NOT NULL | - | 이미지 URL |
| alt_text | VARCHAR(200) | NULL | - | 이미지 대체 텍스트 |
| sort_order | INT | NOT NULL | 0 | 이미지 정렬 순서 |
| is_main | BOOLEAN | NOT NULL | FALSE | 대표 이미지 여부 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 생성일시 |

#### 인덱스
```sql
PRIMARY KEY (id)
INDEX idx_product_images_product_id (product_id)
INDEX idx_product_images_sort_order (sort_order)
INDEX idx_product_images_is_main (is_main)
```

---

### 5. Orders (주문)

**테이블명**: `orders`
**설명**: 사용자 주문 정보를 저장하는 테이블

| 컬럼명 | 데이터 타입 | 제약 조건 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | BIGINT | PK, AUTO_INCREMENT | - | 주문 고유 ID |
| user_id | BIGINT | FK, NOT NULL | - | 주문한 사용자 ID |
| order_number | VARCHAR(50) | UNIQUE, NOT NULL | - | 주문 번호 |
| total_amount | DECIMAL(12,2) | NOT NULL | - | 총 주문 금액 |
| discount_amount | DECIMAL(12,2) | NOT NULL | 0.00 | 할인 금액 |
| final_amount | DECIMAL(12,2) | NOT NULL | - | 최종 결제 금액 |
| status | ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED') | NOT NULL | 'PENDING' | 주문 상태 |
| payment_method | ENUM('CARD', 'BANK_TRANSFER', 'KAKAO_PAY', 'NAVER_PAY') | NOT NULL | - | 결제 수단 |
| payment_status | ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') | NOT NULL | 'PENDING' | 결제 상태 |
| shipping_name | VARCHAR(50) | NOT NULL | - | 받는 사람 이름 |
| shipping_phone | VARCHAR(20) | NOT NULL | - | 받는 사람 전화번호 |
| shipping_address | TEXT | NOT NULL | - | 배송 주소 |
| shipping_memo | TEXT | NULL | - | 배송 메모 |
| order_date | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 주문일시 |
| shipped_at | TIMESTAMP | NULL | NULL | 배송일시 |
| delivered_at | TIMESTAMP | NULL | NULL | 배송완료일시 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP ON UPDATE | 수정일시 |

#### 인덱스
```sql
PRIMARY KEY (id)
UNIQUE KEY uk_orders_order_number (order_number)
INDEX idx_orders_user_id (user_id)
INDEX idx_orders_status (status)
INDEX idx_orders_payment_status (payment_status)
INDEX idx_orders_order_date (order_date)

-- 복합 인덱스
INDEX idx_orders_user_status (user_id, status)
INDEX idx_orders_status_date (status, order_date)
```

#### 제약 조건
```sql
-- 금액 검증
CONSTRAINT chk_orders_amounts_positive
CHECK (total_amount >= 0 AND discount_amount >= 0 AND final_amount >= 0)

CONSTRAINT chk_orders_final_amount_valid
CHECK (final_amount = total_amount - discount_amount)
```

---

### 6. Order_Items (주문 상품)

**테이블명**: `order_items`
**설명**: 주문에 포함된 개별 상품 정보

| 컬럼명 | 데이터 타입 | 제약 조건 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | BIGINT | PK, AUTO_INCREMENT | - | 주문 상품 ID |
| order_id | BIGINT | FK, NOT NULL | - | 주문 ID |
| product_id | BIGINT | FK, NOT NULL | - | 상품 ID |
| product_name | VARCHAR(200) | NOT NULL | - | 주문 시점 상품명 |
| product_price | DECIMAL(12,2) | NOT NULL | - | 주문 시점 상품 가격 |
| quantity | INT | NOT NULL | - | 주문 수량 |
| subtotal | DECIMAL(12,2) | NOT NULL | - | 소계 (가격 × 수량) |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 생성일시 |

#### 인덱스
```sql
PRIMARY KEY (id)
INDEX idx_order_items_order_id (order_id)
INDEX idx_order_items_product_id (product_id)

-- 복합 인덱스
UNIQUE KEY uk_order_items_order_product (order_id, product_id)
```

#### 제약 조건
```sql
-- 수량 및 금액 검증
CONSTRAINT chk_order_items_quantity_positive CHECK (quantity > 0)
CONSTRAINT chk_order_items_price_positive CHECK (product_price >= 0)
CONSTRAINT chk_order_items_subtotal_valid
CHECK (subtotal = product_price * quantity)
```

---

### 7. Shopping_Cart (장바구니)

**테이블명**: `shopping_cart`
**설명**: 사용자별 장바구니 상품 정보

| 컬럼명 | 데이터 타입 | 제약 조건 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | BIGINT | PK, AUTO_INCREMENT | - | 장바구니 항목 ID |
| user_id | BIGINT | FK, NOT NULL | - | 사용자 ID |
| product_id | BIGINT | FK, NOT NULL | - | 상품 ID |
| quantity | INT | NOT NULL | 1 | 수량 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP ON UPDATE | 수정일시 |

#### 인덱스
```sql
PRIMARY KEY (id)
INDEX idx_shopping_cart_user_id (user_id)
INDEX idx_shopping_cart_product_id (product_id)

-- 복합 인덱스
UNIQUE KEY uk_shopping_cart_user_product (user_id, product_id)
```

#### 제약 조건
```sql
CONSTRAINT chk_shopping_cart_quantity_positive CHECK (quantity > 0)
```

---

### 8. Product_Reviews (상품 리뷰) - 선택사항

**테이블명**: `product_reviews`
**설명**: 상품별 사용자 리뷰 정보

| 컬럼명 | 데이터 타입 | 제약 조건 | 기본값 | 설명 |
|--------|-------------|-----------|--------|------|
| id | BIGINT | PK, AUTO_INCREMENT | - | 리뷰 ID |
| product_id | BIGINT | FK, NOT NULL | - | 상품 ID |
| user_id | BIGINT | FK, NOT NULL | - | 작성자 ID |
| order_id | BIGINT | FK, NOT NULL | - | 구매 주문 ID |
| rating | INT | NOT NULL | - | 평점 (1-5) |
| title | VARCHAR(200) | NULL | - | 리뷰 제목 |
| content | TEXT | NULL | - | 리뷰 내용 |
| status | ENUM('ACTIVE', 'HIDDEN', 'DELETED') | NOT NULL | 'ACTIVE' | 리뷰 상태 |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP ON UPDATE | 수정일시 |

---

## 🔗 외래키 관계

```sql
-- Users 관련
ALTER TABLE orders ADD CONSTRAINT fk_orders_user_id
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE shopping_cart ADD CONSTRAINT fk_shopping_cart_user_id
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Products 관련
ALTER TABLE products ADD CONSTRAINT fk_products_category_id
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

ALTER TABLE product_images ADD CONSTRAINT fk_product_images_product_id
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product_id
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

ALTER TABLE shopping_cart ADD CONSTRAINT fk_shopping_cart_product_id
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Orders 관련
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order_id
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- Categories 관련 (자기 참조)
ALTER TABLE categories ADD CONSTRAINT fk_categories_parent_id
FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL;
```

---

## 📈 성능 최적화

### 1. 인덱스 최적화
- 조회 성능을 위한 복합 인덱스 생성
- 정렬 및 필터링에 사용되는 컬럼에 인덱스 적용
- 불필요한 인덱스 최소화로 쓰기 성능 보장

### 2. 파티셔닝 전략 (향후 적용)
```sql
-- Orders 테이블 월별 파티셔닝 (대용량 데이터 시)
ALTER TABLE orders PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at))
(
    PARTITION p202501 VALUES LESS THAN (202502),
    PARTITION p202502 VALUES LESS THAN (202503),
    -- ... 계속
);
```

### 3. 읽기 전용 복제본
- 조회 전용 쿼리는 Read Replica 활용
- 대시보드 및 통계 쿼리 분산 처리

---

## 🛡 보안 고려사항

### 1. 데이터 암호화
- 사용자 비밀번호: BCrypt 해시
- 개인정보: AES-256 암호화 (필요시)
- 데이터베이스 연결: SSL/TLS 적용

### 2. 접근 권한 관리
```sql
-- 애플리케이션 전용 계정 생성
CREATE USER 'travel_app'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON travel_shopping.* TO 'travel_app'@'%';

-- 읽기 전용 계정 (분석용)
CREATE USER 'travel_readonly'@'%' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON travel_shopping.* TO 'travel_readonly'@'%';
```

### 3. 감사 로그
- 중요 데이터 변경 시 감사 로그 기록
- 사용자 활동 추적 (로그인, 주문, 결제 등)

---

## 🚀 초기 데이터 설정

### 1. 기본 카테고리 데이터
```sql
INSERT INTO categories (name, description, parent_id, sort_order) VALUES
('여행상품', '전체 여행상품 카테고리', NULL, 1),
('국내여행', '대한민국 국내 여행 상품', 1, 1),
('해외여행', '해외 여행 상품', 1, 2),
('액티비티', '체험형 여행 상품', 1, 3);

INSERT INTO categories (name, parent_id, sort_order) VALUES
('서울/경기', 2, 1),
('강원도', 2, 2),
('제주도', 2, 3),
('아시아', 3, 1),
('유럽', 3, 2),
('미주', 3, 3);
```

### 2. 관리자 계정 생성
```sql
INSERT INTO users (email, password, name, role, status) VALUES
('admin@travelshop.com', '$2a$10$encrypted_password_hash', '관리자', 'ADMIN', 'ACTIVE');
```

---

## 📋 백업 및 복구 계획

### 1. 백업 전략
- **전체 백업**: 주 1회 (일요일 새벽 2시)
- **증분 백업**: 일 1회 (매일 새벽 3시)
- **트랜잭션 로그 백업**: 15분마다

### 2. 복구 계획
- **RTO** (Recovery Time Objective): 1시간 이내
- **RPO** (Recovery Point Objective): 15분 이내
- **테스트**: 월 1회 복구 테스트 수행

---

**문서 버전**: 1.0
**최종 검토**: 2025-09-16
**다음 리뷰 예정**: 2025-09-30