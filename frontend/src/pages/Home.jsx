import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchCategories, fetchProducts } from '../services/productService'

function Home() {
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [products, categories] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ])
        setFeaturedProducts(products.slice(0, 4))
        setCategoryList(categories)
      } catch (err) {
        setError(err.message || '홈 데이터를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '6rem 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80") center/cover',
          opacity: 0.2
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            lineHeight: '1.1'
          }}>
            🌍 세상으로 떠나는 여행
          </h1>
          <p style={{
            fontSize: '1.5rem',
            marginBottom: '3rem',
            opacity: 0.95,
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            잊을 수 없는 추억을 만들어줄 특별한 여행상품을 만나보세요
          </p>
          <button
            className="btn btn-primary"
            style={{
              fontSize: '1.25rem',
              padding: '1rem 3rem',
              backgroundColor: 'white',
              color: '#667eea',
              border: 'none',
              fontWeight: '700',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate('/products')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)'
              e.target.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
            }}
          >
            🏖️ 여행 상품 둘러보기
          </button>
        </div>
      </section>

      <div className="container" style={{ padding: '4rem 2rem' }}>
        {/* Featured Products Section */}
        <section style={{ marginBottom: '5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem'
          }}>
            <div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                ✨ 인기 여행 상품
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                다른 여행자들이 선택한 베스트 여행지
              </p>
            </div>
            <Link
              to="/products"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                border: '2px solid #e5e7eb',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#3b82f6'
                e.target.style.color = 'white'
                e.target.style.borderColor = '#3b82f6'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f8fafc'
                e.target.style.color = '#3b82f6'
                e.target.style.borderColor = '#e5e7eb'
              }}
            >
              전체 보기 →
            </Link>
          </div>

          {isLoading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4rem',
              fontSize: '1.125rem',
              color: '#6b7280'
            }}>
              <div style={{ marginRight: '1rem' }}>🔄</div>
              추천 상품을 불러오는 중입니다...
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              ❌ {error}
            </div>
          )}

          {!isLoading && !error && featuredProducts.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏝️</div>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>아직 준비된 상품이 없습니다</p>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: '1px solid #f3f4f6'
                }}
                onClick={() => navigate(`/products/${product.id}`)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)'
                  e.target.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      height: '220px',
                      backgroundColor: '#f8fafc',
                      backgroundImage: product.mainImageUrl ? `url(${product.mainImageUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  {product.effectivePrice < product.price && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}>
                      💥 특가
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '0.75rem',
                    color: '#1f2937'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    marginBottom: '1rem',
                    height: '2.4rem',
                    overflow: 'hidden'
                  }}>
                    {product.shortDescription || '환상적인 여행이 여러분을 기다리고 있습니다.'}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      color: '#3b82f6'
                    }}>
                      ₩{Number(product.effectivePrice || product.price || 0).toLocaleString()}
                    </div>
                    <div style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f8fafc',
                      color: '#3b82f6',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      자세히 보기 →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              🗺️ 여행 카테고리
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              원하는 여행 스타일을 선택하세요
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {categoryList.map((category, index) => {
              const categoryIcons = ['🏔️', '✈️', '🎯']
              const categoryColors = ['#10b981', '#3b82f6', '#f59e0b']
              return (
                <div
                  key={category.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    border: '1px solid #f3f4f6'
                  }}
                  onClick={() => navigate(`/products?category=${category.id}`)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-6px)'
                    e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: categoryColors[index % categoryColors.length],
                      borderRadius: '50%',
                      margin: '0 auto 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      boxShadow: `0 8px 24px ${categoryColors[index % categoryColors.length]}40`
                    }}
                  >
                    {categoryIcons[index % categoryIcons.length]}
                  </div>
                  <h3 style={{
                    fontSize: '1.375rem',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '0.5rem'
                  }}>
                    {category.name}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                    {category.description || '다양한 여행 상품을 둘러보세요'}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
