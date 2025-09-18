import React, { useMemo, useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { createOrder } from '../services/orderService'

const paymentOptions = [
  { value: 'CARD', label: '신용/체크카드' },
  { value: 'KAKAO_PAY', label: '카카오페이' },
  { value: 'BANK_TRANSFER', label: '계좌이체' },
  { value: 'NAVER_PAY', label: '네이버페이' },
]

function Cart() {
  const { items, totalAmount, totalQuantity, updateQuantity, removeFromCart, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [orderForm, setOrderForm] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
    paymentMethod: paymentOptions[0].value,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const isEmpty = useMemo(() => items.length === 0, [items])

  const handleQuantityChange = (productId, quantity) => {
    const parsed = Number(quantity)
    if (parsed >= 0) {
      updateQuantity(productId, parsed)
    }
  }

  const handleRemove = (productId) => {
    removeFromCart(productId)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setOrderForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleOrderSubmit = async (event) => {
    event.preventDefault()
    if (!isAuthenticated) {
      setFeedback({ type: 'warning', message: '주문을 진행하려면 로그인이 필요합니다.' })
      return
    }
    if (isEmpty) {
      setFeedback({ type: 'warning', message: '장바구니가 비어 있습니다.' })
      return
    }

    try {
      setIsSubmitting(true)
      setFeedback(null)
      const payload = {
        shippingName: orderForm.shippingName,
        shippingPhone: orderForm.shippingPhone,
        shippingAddress: orderForm.shippingAddress,
        paymentMethod: orderForm.paymentMethod,
        items: items.map((item) => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
        })),
      }
      const response = await createOrder(payload)
      await clearCart()
      setFeedback({ type: 'success', message: `주문이 완료되었습니다. 주문번호: ${response.orderNumber}` })
    } catch (error) {
      setFeedback({ type: 'danger', message: error.message || '주문 생성 중 오류가 발생했습니다.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>장바구니</h1>

      {feedback && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor:
              feedback.type === 'success' ? '#dcfce7' : feedback.type === 'warning' ? '#fef3c7' : '#fee2e2',
            color:
              feedback.type === 'success' ? '#166534' : feedback.type === 'warning' ? '#92400e' : '#b91c1c',
          }}
        >
          {feedback.message}
        </div>
      )}

      {isEmpty ? (
        <p>장바구니에 담긴 상품이 없습니다.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div key={item.productId || item.id} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: 'var(--gray-200)',
                    borderRadius: '8px',
                    backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.name}</h3>
                  <p style={{ margin: '0.5rem 0', color: 'var(--gray-600)' }}>
                    가격: ₩{Number(item.price || 0).toLocaleString()} / 합계: ₩{Number(item.subtotal || item.price * item.quantity || 0).toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <label htmlFor={`quantity-${item.productId || item.id}`}>수량</label>
                    <input
                      id={`quantity-${item.productId || item.id}`}
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(event) => handleQuantityChange(item.productId || item.id, event.target.value)}
                      style={{ width: '80px', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                    />
                    <button className="btn btn-text" type="button" onClick={() => handleRemove(item.productId || item.id)}>
                      제거
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary" style={{ position: 'sticky', top: '2rem', alignSelf: 'flex-start' }}>
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>주문 요약</h2>
              <p>총 수량: {totalQuantity}개</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                결제 금액: ₩{Number(totalAmount || 0).toLocaleString()}
              </p>
              <button className="btn btn-secondary" type="button" onClick={clearCart} style={{ marginTop: '1rem' }}>
                장바구니 비우기
              </button>
            </div>

            <form className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleOrderSubmit}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>배송 및 결제 정보</h2>
              <input
                name="shippingName"
                placeholder="수령인 이름"
                value={orderForm.shippingName}
                onChange={handleFormChange}
                required
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
              />
              <input
                name="shippingPhone"
                placeholder="연락처"
                value={orderForm.shippingPhone}
                onChange={handleFormChange}
                required
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
              />
              <textarea
                name="shippingAddress"
                placeholder="배송지 주소"
                value={orderForm.shippingAddress}
                onChange={handleFormChange}
                required
                rows={3}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
              />
              <select
                name="paymentMethod"
                value={orderForm.paymentMethod}
                onChange={handleFormChange}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
              >
                {paymentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? '주문 처리 중...' : '주문 신청'}
              </button>
            </form>
          </aside>
        </div>
      )}
    </div>
  )
}

export default Cart
