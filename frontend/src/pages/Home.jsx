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
    <div className="container">
      <section className="hero-section" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--gray-800)' }}>
          최고의 여행을 시작하세요
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', marginBottom: '2rem' }}>
          국내외 다양한 여행 상품을 한 곳에서 만나보세요
        </p>
        <button
          className="btn btn-primary"
          style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}
          onClick={() => navigate('/products')}
        >
          상품 둘러보기
        </button>
      </section>

      <section className="featured-products" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>추천 여행 상품</h2>
          <Link to="/products" className="link">
            전체 보기 &rarr;
          </Link>
        </div>

        {isLoading && <p>추천 상품을 불러오는 중입니다...</p>}
        {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}

        {!isLoading && !error && featuredProducts.length === 0 && (
          <p>표시할 추천 상품이 없습니다.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4" style={{ gap: '1.5rem' }}>
          {featuredProducts.map((product) => (
            <div key={product.id} className="card" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  height: '200px',
                  backgroundColor: 'var(--gray-200)',
                  backgroundImage: product.mainImageUrl ? `url(${product.mainImageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{product.name}</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {product.shortDescription || '상품 설명이 준비 중입니다.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    ₩{Number(product.effectivePrice || product.price || 0).toLocaleString()}
                  </span>
                  <Link to={`/products/${product.id}`} className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                    상세보기
                  </Link>
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
          {categoryList.map((category) => (
            <div
              key={category.id}
              className="card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onClick={() => navigate(`/products?category=${category.id}`)}
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
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
