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
    <div className="container" style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr',
          gap: '2rem'
        }
      }}>
        <div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '75%',
              borderRadius: '16px',
              backgroundColor: '#f8fafc',
              backgroundImage: product.mainImageUrl ? `url(${product.mainImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}
          >
            {product.salePrice && (
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
                할인중
              </div>
            )}
          </div>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {product.images?.map((image) => (
              <div
                key={image.id}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  backgroundImage: image.imageUrl ? `url(${image.imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '2px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    transform: 'scale(1.05)',
                    borderColor: '#3b82f6'
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ padding: '1rem 0' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            {product.categoryName || '미분류'}
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            lineHeight: '1.2',
            color: '#1f2937'
          }}>
            {product.name}
          </h1>

          <p style={{
            color: '#6b7280',
            marginBottom: '2rem',
            fontSize: '1.125rem',
            lineHeight: '1.6'
          }}>
            {product.shortDescription}
          </p>

          <div style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#3b82f6'
              }}>
                ₩{Number(product.effectivePrice || product.price || 0).toLocaleString()}
              </span>
              {product.salePrice && (
                <>
                  <span style={{
                    fontSize: '1.25rem',
                    textDecoration: 'line-through',
                    color: '#9ca3af'
                  }}>
                    ₩{Number(product.price || 0).toLocaleString()}
                  </span>
                  <span style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {Math.round((1 - (product.effectivePrice / product.price)) * 100)}% 할인
                  </span>
                </>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              fontSize: '0.95rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#6b7280' }}>재고:</span>
                <span style={{
                  fontWeight: '600',
                  color: product.stockQuantity > 10 ? '#059669' : product.stockQuantity > 0 ? '#d97706' : '#dc2626'
                }}>
                  {product.stockQuantity}개
                </span>
              </div>
              {product.ratingAverage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#6b7280' }}>평점:</span>
                  <span style={{ fontWeight: '600', color: '#f59e0b' }}>
                    ⭐ {product.ratingAverage}
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    ({product.ratingCount || 0}개 리뷰)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '2px solid #e5e7eb'
          }}>
            <label htmlFor="quantity" style={{
              fontWeight: '600',
              color: '#374151',
              minWidth: '40px'
            }}>
              수량:
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stockQuantity || 99}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              style={{
                width: '100px',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                textAlign: 'center'
              }}
            />
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              style={{
                flex: 1,
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '10px',
                backgroundColor: product.stockQuantity === 0 ? '#9ca3af' : '#3b82f6',
                border: 'none',
                color: 'white',
                cursor: product.stockQuantity === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              {product.stockQuantity === 0 ? '품절' : '장바구니 담기'}
            </button>
          </div>

          {!isAuthenticated && (
            <div style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              border: '1px solid #fde68a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>💡</span>
              <span>로그인을 하시면 장바구니 상태가 저장됩니다.</span>
            </div>
          )}

          {feedback && (
            <div style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>✅</span>
              <span>{feedback}</span>
            </div>
          )}

          <section style={{
            marginTop: '3rem',
            padding: '2rem',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#1f2937',
              borderBottom: '3px solid #3b82f6',
              paddingBottom: '0.5rem',
              display: 'inline-block'
            }}>
              상품 소개
            </h2>
            <p style={{
              lineHeight: 1.8,
              color: '#4b5563',
              fontSize: '1.1rem'
            }}>
              {product.description}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
