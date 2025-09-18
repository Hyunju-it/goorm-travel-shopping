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
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🧳 여행쇼핑몰
        </Link>

        <nav>
          <ul className="nav-links">
            <li><Link to="/products">상품</Link></li>
                        {isAuthenticated && user?.role === 'ADMIN' && (
              <li><Link to="/admin">관리자</Link></li>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link to="/mypage" className="btn btn-secondary">
                👤 {user?.name || '마이페이지'}
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                로그인
              </Link>
              <Link to="/register" className="btn btn-primary">
                회원가입
              </Link>
            </>
          )}

          <Link
            to="/cart"
            className="btn btn-primary"
            style={{ position: 'relative' }}
          >
            🛒 장바구니
            {totalQuantity > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#b91c1c',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '20px',
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