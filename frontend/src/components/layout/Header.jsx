import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalQuantity } = useCart()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link
          to="/"
          style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          ✈️ 여행쇼핑몰
        </Link>

        <nav>
          <ul style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            margin: 0,
            padding: 0,
            listStyle: 'none'
          }}>
            <li>
              <Link
                to="/products"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  opacity: 0.9
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
                  e.target.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.opacity = '0.9'
                }}
              >
                🏖️ 상품 둘러보기
              </Link>
            </li>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <li>
                <Link
                  to="/admin"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    opacity: 0.9,
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.25)'
                    e.target.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'
                    e.target.style.opacity = '0.9'
                  }}
                >
                  ⚙️ 관리자
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {isAuthenticated ? (
            <>
              <Link
                to="/mypage"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.25)'
                  e.target.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                👤 {user?.name || '마이페이지'}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  color: 'white',
                  fontWeight: '600',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
                  e.target.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.25)'
                  e.target.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                로그인
              </Link>
              <Link
                to="/register"
                style={{
                  color: '#667eea',
                  backgroundColor: 'white',
                  textDecoration: 'none',
                  fontWeight: '700',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8fafc'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                회원가입
              </Link>
            </>
          )}

          <Link
            to="/cart"
            style={{
              position: 'relative',
              color: '#667eea',
              backgroundColor: 'white',
              textDecoration: 'none',
              fontWeight: '700',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              transition: 'all 0.2s ease',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8fafc'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            🛒 장바구니
            {totalQuantity > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '24px',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                  animation: 'pulse 2s infinite'
                }}
              >
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header