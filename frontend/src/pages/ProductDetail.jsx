import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductDetail } from '../services/productService'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchProductDetail(id)
        setProduct(data)
      } catch (err) {
        setError(err.message || '상품 정보를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    loadProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return

    // 재고 검증
    if (product.stockQuantity === 0) {
      alert('죄송합니다. 해당 상품은 현재 품절되었습니다.')
      return
    }

    if (quantity > product.stockQuantity) {
      alert(`재고가 부족합니다. 현재 재고: ${product.stockQuantity}개`)
      return
    }

    const result = await addToCart(product, quantity)
    if (result.success) {
      setFeedback('장바구니에 상품이 추가되었습니다.')
    } else {
      setFeedback(result.error || '장바구니 추가에 실패했습니다.')
    }
  }

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <p>상품 정보를 불러오는 중입니다...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <p style={{ color: 'var(--danger-color)' }}>{error}</p>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <div
            style={{
              width: '100%',
              paddingTop: '75%',
              borderRadius: '12px',
              backgroundColor: 'var(--gray-200)',
              backgroundImage: product.mainImageUrl ? `url(${product.mainImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {product.images?.map((image) => (
              <div
                key={image.id}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--gray-200)',
                  backgroundImage: image.imageUrl ? `url(${image.imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{product.name}</h1>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>{product.shortDescription}</p>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              ₩{Number(product.effectivePrice || product.price || 0).toLocaleString()}
            </span>
            {product.salePrice && (
              <span style={{ marginLeft: '1rem', textDecoration: 'line-through', color: 'var(--gray-500)' }}>
                ₩{Number(product.price || 0).toLocaleString()}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '1rem', color: 'var(--gray-600)' }}>
            <p>카테고리: {product.categoryName || '미분류'}</p>
            <p>남은 재고: {product.stockQuantity}개</p>
            {product.ratingAverage && (
              <p>
                평점: {product.ratingAverage} ({product.ratingCount || 0}개 리뷰)
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <label htmlFor="quantity" style={{ fontWeight: 600 }}>
              수량
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stockQuantity || 99}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              style={{ width: '80px', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
            />
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={product.stockQuantity === 0}>
              장바구니 담기
            </button>
          </div>

          {!isAuthenticated && (
            <p style={{ color: '#d97706', marginBottom: '1rem' }}>
              로그인을 하시면 장바구니 상태가 저장됩니다.
            </p>
          )}

          {feedback && <p style={{ color: '#16a34a', marginBottom: '1.5rem' }}>{feedback}</p>}

          <section style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>상품 소개</h2>
            <p style={{ lineHeight: 1.7, color: 'var(--gray-700)' }}>{product.description}</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
