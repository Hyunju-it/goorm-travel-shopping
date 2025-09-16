import React from 'react'

function Home() {
  return (
    <div className="container">
      <section className="hero-section" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--gray-800)' }}>
          최고의 여행을 시작하세요
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', marginBottom: '2rem' }}>
          국내외 다양한 여행 상품을 한 곳에서 만나보세요
        </p>
        <button className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}>
          상품 둘러보기
        </button>
      </section>

      <section className="featured-products" style={{ padding: '2rem 0' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
          추천 여행 상품
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4" style={{ gap: '1.5rem' }}>
          {/* 임시 상품 카드들 */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: '200px', backgroundColor: 'var(--gray-200)' }}>
                {/* 이미지 플레이스홀더 */}
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  여행 상품 {item}
                </h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  상품 설명이 들어갑니다
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    ₩{(100000 * item).toLocaleString()}
                  </span>
                  <button className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                    담기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="categories" style={{ padding: '2rem 0' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
          여행 카테고리
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1rem' }}>
          {['국내여행', '해외여행', '액티비티', '패키지'].map((category) => (
            <div
              key={category}
              className="card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'var(--primary-color)',
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                }}
              />
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{category}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home