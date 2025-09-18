import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const { login, error, setError, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, location.state, navigate])

  useEffect(() => {
    return () => {
      setError(null)
      setFeedback(null)
    }
  }, [setError])

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)
    const result = await login(credentials)
    if (!result.success) {
      setFeedback(result.error || '로그인에 실패했습니다.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '420px', margin: '0 auto', padding: '3rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>로그인</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label htmlFor="email" style={{ fontWeight: 600 }}>
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          required
          placeholder="email@example.com"
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
        />

        <label htmlFor="password" style={{ fontWeight: 600 }}>
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          required
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
        />

        {(feedback || error) && (
          <p style={{ color: '#b91c1c', marginTop: '0.5rem' }}>{feedback || error}</p>
        )}

        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        아직 계정이 없으신가요? <Link to="/register">회원가입하기</Link>
      </p>
      <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#4b5563', textAlign: 'center' }}>
        <p>관리자 계정: <strong>admin@travelshop.com</strong> / <strong>admin123</strong></p>
        <p>테스트 사용자: <strong>user@test.com</strong> / <strong>user123</strong></p>
      </div>
    </div>
  )
}

export default Login
