import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fetchOrderDetail } from '../services/orderService'

function OrderDetail() {
  const { orderNumber } = useParams()
  const { isAuthenticated, isLoading } = useAuth()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrder() {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }
      try {
        const data = await fetchOrderDetail(orderNumber)
        setOrder(data)
      } catch (err) {
        setError(err.message || '주문 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [isAuthenticated, orderNumber])

  if (isLoading || loading) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <p>주문 정보를 불러오는 중입니다...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <p>주문을 확인하려면 로그인이 필요합니다.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <p style={{ color: '#b91c1c' }}>{error}</p>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>주문 상세 정보</h1>
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <p>주문번호: {order.orderNumber}</p>
        <p>주문일: {order.orderDate ? new Date(order.orderDate).toLocaleString() : '-'}</p>
        <p>주문 상태: {order.status}</p>
        <p>결제 수단: {order.paymentMethod}</p>
        <p>결제 상태: {order.paymentStatus}</p>
        <p>총 금액: ₩{Number(order.totalAmount || 0).toLocaleString()}</p>
        <p>할인 금액: ₩{Number(order.discountAmount || 0).toLocaleString()}</p>
        <p>결제 금액: ₩{Number(order.finalAmount || 0).toLocaleString()}</p>
      </div>

      <section className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>배송 정보</h2>
        <p>수령인: {order.shippingName}</p>
        <p>연락처: {order.shippingPhone}</p>
        <p>배송지: {order.shippingAddress}</p>
      </section>

      <section className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>주문 상품</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {order.items?.map((item) => (
            <div key={item.productId} style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.75rem' }}>
              <p style={{ fontWeight: 600 }}>{item.productName}</p>
              <p>
                수량: {item.quantity} | 단가: ₩{Number(item.productPrice || 0).toLocaleString()} | 합계: ₩
                {Number(item.subtotal || 0).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default OrderDetail
