# 통합 여행 쇼핑몰 프로젝트 설계 및 기획 문서

## 📋 프로젝트 개요

### 프로젝트명
**통합 여행 쇼핑몰 (Travel Shopping Mall)**

### 프로젝트 목표
- 여행 상품을 판매하는 통합 쇼핑몰 플랫폼 구축
- 사용자 친화적인 UI/UX 제공
- 안전한 결제 시스템 구현
- 확장 가능한 아키텍처 설계

## 🏗 시스템 아키텍처

### 전체 구조
```
Frontend (React)  ←→  Backend (Spring Boot)  ←→  Database (MySQL)
      ↓                      ↓                        ↓
   Vapor UI            Spring Security           AWS RDS
   Context API         JPA/Hibernate
```

### 주요 컴포넌트
- **사용자 관리**: 회원가입, 로그인, 프로필 관리
- **상품 관리**: 상품 등록, 수정, 삭제, 조회
- **주문 관리**: 장바구니, 주문, 결제
- **검색/필터**: 상품 검색 및 카테고리 필터링

## 🎯 핵심 기능 명세

### 1. 사용자 관리 시스템
- **회원가입**: 이메일 인증, 필수/선택 정보 입력
- **로그인/로그아웃**: Session 기반 인증
- **권한 관리**: 일반 사용자 / 관리자 구분
- **프로필 관리**: 개인정보 수정, 비밀번호 변경

### 2. 상품 관리 시스템
- **상품 조회**: 리스트/상세보기, 이미지 갤러리
- **상품 검색**: 키워드 검색, 카테고리별 필터링
- **상품 관리** (관리자): CRUD 기능, 이미지 업로드

### 3. 주문 및 결제 시스템
- **장바구니**: 상품 추가/삭제, 수량 조절
- **주문 프로세스**: 배송지 입력, 결제 수단 선택
- **결제 연동**: 가상 결제 시스템 구현
- **주문 내역**: 사용자별 주문 이력 관리

## 📊 데이터베이스 설계

### 주요 테이블 구조

#### Users (사용자)
- id, email, password, name, phone, address
- role (USER/ADMIN), created_at, updated_at

#### Products (상품)
- id, name, description, price, category_id
- image_url, stock_quantity, created_at, updated_at

#### Orders (주문)
- id, user_id, total_amount, status
- shipping_address, created_at, updated_at

#### Order_Items (주문 상품)
- id, order_id, product_id, quantity, price

### ERD 관계
- User : Order = 1 : N
- Order : Order_Item = 1 : N
- Product : Order_Item = 1 : N

## 🎨 UI/UX 설계

### 화면 구성
1. **메인 페이지**: 추천 상품, 카테고리, 검색
2. **상품 목록**: 필터링, 정렬, 페이징
3. **상품 상세**: 이미지, 설명, 리뷰, 구매 버튼
4. **장바구니**: 선택 상품, 수량 조절, 결제
5. **마이페이지**: 주문 내역, 프로필 관리
6. **관리자 페이지**: 상품/주문/사용자 관리

### 디자인 가이드라인
- **UI Framework**: Vapor (Goorm Design System)
- **반응형 디자인**: 모바일/태블릿/데스크톱 대응
- **접근성**: 웹 접근성 지침 준수
- **브랜드 컬러**: 여행 테마에 맞는 색상 팔레트

## 🔒 보안 고려사항

### 인증 및 인가
- Spring Security 기반 Session 인증
- CSRF 토큰 적용
- 비밀번호 암호화 (BCrypt)
- SQL Injection 방지 (JPA 사용)

### 데이터 보안
- 개인정보 암호화 저장
- HTTPS 통신 강제
- 입력 데이터 검증 및 sanitization

## 🚀 배포 전략

### AWS 인프라
- **EC2**: 애플리케이션 서버 호스팅
- **RDS**: MySQL 데이터베이스
- **S3**: 상품 이미지 저장
- **CloudFront**: CDN 적용 (선택사항)

### CI/CD 파이프라인
- Git 기반 버전 관리
- 자동화된 테스트 실행
- 단계별 배포 (개발 → 스테이징 → 운영)

## 📈 성능 최적화

### Backend 최적화
- JPA N+1 문제 해결 (Fetch Join)
- Redis 캐싱 적용 (선택사항)
- Connection Pool 설정
- 데이터베이스 인덱스 최적화

### Frontend 최적화
- React.memo, useCallback 활용
- 이미지 lazy loading
- Bundle size 최적화
- Virtual scrolling (대용량 리스트)

## 🧪 테스트 전략

### 테스트 유형
- **Unit Test**: 개별 기능 단위 테스트
- **Integration Test**: API 연동 테스트
- **E2E Test**: 전체 사용자 시나리오 테스트

### 테스트 도구
- Backend: JUnit, MockMvc, TestContainers
- Frontend: Jest, React Testing Library
- API: Postman Collection

## 📅 개발 일정

### Phase 1: 기반 구축(1일차)
- 프로젝트 세팅
- DB 설계 및 구축
- 기본 인증 시스템

### Phase 2: 핵심 기능(2일차)
- 상품 관리 시스템
- 주문 및 결제 시스템
- UI 컴포넌트 구현

### Phase 3: 고도화(3일차)
- 검색/필터 기능
- 테스트 자동화
- 성능 최적화

### Phase 4: 배포 및 마무리(4일차)
- AWS 배포
- 문서화 완료
- 발표 준비

---

**문서 작성일**: 2025-09-16
**작성자**: 개발팀
**버전**: 1.0