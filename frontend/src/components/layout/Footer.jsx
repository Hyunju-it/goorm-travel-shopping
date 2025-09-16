import React from 'react'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            🧳 여행쇼핑몰
          </h3>
          <p style={{ color: 'var(--gray-300)' }}>
            최고의 여행 상품을 제공하는 통합 쇼핑몰
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h4 style={{ marginBottom: '1rem' }}>고객센터</h4>
            <p style={{ color: 'var(--gray-300)', fontSize: '0.875rem' }}>
              📞 1588-0000<br />
              📧 support@travelshop.com<br />
              🕒 평일 09:00 - 18:00
            </p>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem' }}>회사정보</h4>
            <p style={{ color: 'var(--gray-300)', fontSize: '0.875rem' }}>
              주소: 서울시 강남구 테헤란로 123<br />
              사업자등록번호: 123-45-67890<br />
              대표: 홍길동
            </p>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem' }}>서비스</h4>
            <ul style={{
              color: 'var(--gray-300)',
              fontSize: '0.875rem',
              listStyle: 'none'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>국내여행</li>
              <li style={{ marginBottom: '0.5rem' }}>해외여행</li>
              <li style={{ marginBottom: '0.5rem' }}>액티비티</li>
              <li>패키지여행</li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--gray-600)',
          paddingTop: '1rem',
          color: 'var(--gray-400)',
          fontSize: '0.875rem'
        }}>
          <p>&copy; 2025 여행쇼핑몰. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer