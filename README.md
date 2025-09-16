# 통합 여행 쇼핑몰 프로젝트

**Full-Stack 여행 상품 쇼핑몰 시스템**
Spring Boot 백엔드 + React 프론트엔드 구조

## 🛠 기술 스택

### Backend
- **Framework**: Spring Boot, Spring MVC
- **Database**: h2
- **ORM**: JPA/Hibernate
- **Authentication**: Spring Security (Session 기반)
- **Build Tool**: Maven/Gradle

### Frontend
- **Framework**: React
- **State Management**: Context API
- **UI Framework**: Vapor (Goorm Design System)
- **Build Tool**: Vite/Create React App

### DevOps & Deployment
- **Cloud Platform**: AWS
- **Database**: AWS RDS
- **Hosting**: AWS EC2/Elastic Beanstalk
- **Storage**: AWS S3 (이미지 업로드)

### Testing
- **Backend**: JUnit, MockMvc
- **Frontend**: Jest, React Testing Library
- **Integration**: Postman/Insomnia

## 📁 프로젝트 구조

```
goorm-travel-shopping/
├── docs/                          # 📋 기획 문서들
│   ├── project-planning.md        # 프로젝트 설계 및 기획
│   ├── functional-specification.md # 기능 명세서
│   └── database-design.md         # DB 설계서
├── backend/                       # 🌸 Spring Boot 백엔드
│   ├── pom.xml                   # Maven 설정
│   └── src/main/
│       ├── java/com/goorm/travelshopping/
│       │   ├── TravelShoppingApplication.java
│       │   ├── config/           # 설정 클래스
│       │   ├── controller/       # REST 컨트롤러
│       │   ├── service/          # 비즈니스 로직
│       │   ├── repository/       # 데이터 접근 계층
│       │   ├── entity/           # JPA 엔티티
│       │   ├── dto/              # 데이터 전송 객체
│       │   ├── security/         # 보안 설정
│       │   └── exception/        # 예외 처리
│       └── resources/
│           └── application.yml    # Spring Boot 설정
└── frontend/                      # ⚛️ React 프론트엔드
    ├── package.json              # npm 설정
    ├── vite.config.js            # Vite 설정
    ├── index.html                # HTML 템플릿
    └── src/
        ├── main.jsx              # 앱 엔트리 포인트
        ├── App.jsx               # 메인 컴포넌트
        ├── contexts/             # Context API (상태관리)
        │   ├── AuthContext.jsx   # 인증 상태
        │   └── CartContext.jsx   # 장바구니 상태
        ├── components/           # 재사용 컴포넌트
        │   └── layout/           # 레이아웃 컴포넌트
        │       ├── Header.jsx    # 헤더
        │       └── Footer.jsx    # 푸터
        ├── pages/               # 페이지 컴포넌트
        │   ├── Home.jsx         # 메인 페이지
        │   ├── Products.jsx     # 상품 목록
        │   ├── ProductDetail.jsx # 상품 상세
        │   ├── Cart.jsx         # 장바구니
        │   ├── Login.jsx        # 로그인
        │   ├── Register.jsx     # 회원가입
        │   ├── MyPage.jsx       # 마이페이지
        │   └── Admin.jsx        # 관리자
        ├── services/            # API 호출
        ├── hooks/               # 커스텀 훅
        ├── utils/               # 유틸리티 함수
        ├── assets/              # 이미지, 아이콘
        └── styles/              # CSS 스타일
            ├── index.css         # 글로벌 스타일
            └── App.css           # 앱 스타일
```

## 🚀 프로젝트 실행 방법

### Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
# 또는
mvn clean install
java -jar target/travel-shopping-1.0.0.jar
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### 전체 개발 환경 실행
1. Backend: http://localhost:8080
2. Frontend: http://localhost:3000
3. API: http://localhost:8080/api

## 📋 프로젝트 개발 로드맵

### 1. 프로젝트 기초 설정
- [x] 프로젝트 설계 및 기획 문서 작성
- [x] 기능 명세서 및 DB 설계
- [x] Spring Boot + React 프로젝트 세팅 (Spring MVC, DB 등)

### 2. 백엔드 개발 (Spring Boot)
- [ ] DB 연동 및 테이블 스키마 작성
- [ ] Spring CRUD 기능 구현
- [ ] 서비스/DAO/컨트롤러 계층 로직 구현
- [ ] 회원가입 및 로그인 기능 구현
- [ ] 사용자 인증 및 권한 관리 (세션 및 유효성 검사 처리)
- [ ] 주문 및 결제 로직 구현 (백엔드)

### 3. 프론트엔드 개발 (React)
- [ ] 상품 리스트 UI 구현 및 스타일링
- [ ] Context API 상태관리 도입
- [ ] 상품 관리 UI 및 기능 구현
- [ ] 상품 검색 및 필터 기능 구현
- [ ] Vapor(Goorm Design System) 학습하고 적용하기

### 4. 테스트 및 검증
- [ ] 테스트 코드 및 시나리오 작성
- [ ] 테스트 자동화 및 기능 검증
- [ ] 전체 흐름 테스트 및 시나리오 구성

### 5. 배포 및 문서화
- [ ] AWS 배포 환경 구성
- [ ] AWS 배포 및 발표자료 구성
- [ ] 발표자료 제작 완료
- [ ] 포트폴리오화 및 최종 정리

---
**총 21개 항목** | 3개 프로젝트 통합 완료
