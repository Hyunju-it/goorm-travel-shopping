import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchProducts } from '../services/productService'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')

  useEffect(() => {
    async function loadInitial() {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (err) {
        console.error(err)
      }
    }
    loadInitial()
  }, [])

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true)
        setError(null)
        const params = {}
        const keyword = searchParams.get('keyword')
        const category = searchParams.get('category')
        if (keyword) params.keyword = keyword
        if (category) params.categoryId = category
        const data = await fetchProducts(params)
        setProducts(data)
      } catch (err) {
        setError(err.message || '상품 목록을 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [searchParams])

  const handleSearch = (event) => {
    event.preventDefault()
    const params = {}
    if (searchTerm.trim()) {
      params.keyword = searchTerm.trim()
    }
    if (selectedCategory) {
      params.category = selectedCategory
    }
    setSearchParams(params, { replace: true })
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSearchParams({}, { replace: true })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ padding: '3rem 0' }}>
        <header style={{
          marginBottom: '3rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '3rem 2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            ✈️ 여행 상품 탐색
          </h1>
          <p style={{
            fontSize: '1.25rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            전 세계 아름다운 여행지를 탐험하고 잊을 수 없는 추억을 만들어보세요
          </p>
        </header>

        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          marginBottom: '3rem'
        }}>
          <form
            onSubmit={handleSearch}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              alignItems: 'end'
            }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                🔍 상품 검색
              </label>
              <input
                type="search"
                placeholder="어떤 여행을 꿈꾸시나요?"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  ':focus': { borderColor: '#3b82f6', outline: 'none' }
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                🏷️ 카테고리
              </label>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="">모든 여행지 보기</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  ':hover': { backgroundColor: '#2563eb', transform: 'translateY(-1px)' }
                }}
              >
                검색
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  ':hover': { borderColor: '#9ca3af', backgroundColor: '#f9fafb' }
                }}
              >
                초기화
              </button>
            </div>
          </form>
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
            상품을 불러오는 중입니다...
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '12px',
            textAlign: 'center',
            margin: '2rem 0'
          }}>
            ❌ {error}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧭</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              조건에 맞는 여행 상품이 없습니다
            </h3>
            <p style={{ color: '#6b7280' }}>다른 검색어나 카테고리로 시도해보세요</p>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #f3f4f6',
                ':hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                }
              }}
            >
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    height: '250px',
                    backgroundColor: '#f8fafc',
                    backgroundImage: product.mainImageUrl ? `url(${product.mainImageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
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
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  height: '60px'
                }} />
              </div>

              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  color: '#1f2937',
                  lineHeight: '1.4'
                }}>
                  {product.name}
                </h3>

                <p style={{
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                  height: '3.6rem',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
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
                  <div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      color: '#3b82f6',
                      marginBottom: '0.25rem'
                    }}>
                      ₩{Number(product.effectivePrice || product.price || 0).toLocaleString()}
                    </div>
                    {product.effectivePrice < product.price && (
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#9ca3af',
                        textDecoration: 'line-through'
                      }}>
                        ₩{Number(product.price || 0).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/products/${product.id}`}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#f8fafc',
                      color: '#3b82f6',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      border: '2px solid #e5e7eb',
                      transition: 'all 0.2s ease',
                      display: 'inline-block'
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
                    자세히 보기 →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && !error && products.length > 0 && (
          <div style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌟</div>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              더 많은 여행 상품이 곧 추가될 예정입니다!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
