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
    <div className="container" style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>여행 상품 목록</h1>
        <p style={{ color: 'var(--gray-600)' }}>검색과 필터를 활용해 원하는 상품을 찾아보세요.</p>
      </header>

      <form
        onSubmit={handleSearch}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <input
          type="search"
          placeholder="상품명 또는 설명 검색"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
        />
        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
        >
          <option value="">전체 카테고리</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            검색
          </button>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={handleReset}>
            초기화
          </button>
        </div>
      </form>

      {isLoading && <p>상품을 불러오는 중입니다...</p>}
      {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}

      {!isLoading && !error && products.length === 0 && <p>조건에 맞는 상품이 없습니다.</p>}

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '1.5rem' }}>
        {products.map((product) => (
          <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                height: '220px',
                backgroundColor: 'var(--gray-200)',
                backgroundImage: product.mainImageUrl ? `url(${product.mainImageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>{product.name}</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem', flex: 1 }}>
                {product.shortDescription || '상품 설명이 준비 중입니다.'}
              </p>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    ₩{Number(product.effectivePrice || product.price || 0).toLocaleString()}
                  </span>
                  <Link to={`/products/${product.id}`} className="btn btn-secondary">
                    상세보기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
