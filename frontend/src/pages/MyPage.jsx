import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fetchOrders } from '../services/orderService'

function MyPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login', { replace: true, state: { from: '/mypage' } })
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    async function loadOrders() {
      if (!isAuthenticated) {
        return
      }
      try {
        const data = await fetchOrders()
        setOrders(data)
      } catch (err) {
        setError(err.message || '주문 내역을 불러오지 못했습니다.')
      }
    }
    loadOrders()
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <p>정보를 불러오는 중입니다...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <section style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>마이페이지</h1>
        <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>
          {user.name}님, 안녕하세요. ({user.email})
        </p>
      </section>

      <section className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>내 주문 내역</h2>
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
        {!error && orders.length === 0 && <p>주문 내역이 없습니다.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.orderNumber} className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>주문번호: {order.orderNumber}</h3>
                  <p style={{ color: 'var(--gray-600)' }}>주문일: {new Date(order.orderDate).toLocaleString()}</p>
                  <p style={{ color: 'var(--gray-600)' }}>상태: {order.status}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    ₩{Number(order.finalAmount || 0).toLocaleString()}
                  </p>
                  <Link to={`/orders/${order.orderNumber}`} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
                    상세보기
                  </Link>
                </div>
              </div>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.25rem', color: 'var(--gray-700)' }}>
                {order.items?.map((item) => (
                  <li key={item.productId}>
                    {item.productName} &times; {item.quantity} (₩{Number(item.subtotal || 0).toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default MyPage
