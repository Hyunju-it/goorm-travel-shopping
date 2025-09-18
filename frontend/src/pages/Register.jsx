import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const result = await register(formData)
    if (result.success) {
      setSuccess('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.')
      setTimeout(() => navigate('/login'), 1500)
    } else {
      setError(result.error || '회원가입에 실패했습니다.')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="container" style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>회원가입</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'grid', gap: '1rem' }}>
        <label htmlFor="email" style={{ fontWeight: 600 }}>
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
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
          value={formData.password}
          onChange={handleChange}
          required
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
        />

        <label htmlFor="confirmPassword" style={{ fontWeight: 600 }}>
          비밀번호 확인
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
        />

        <label htmlFor="name" style={{ fontWeight: 600 }}>
          이름
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
        />

        <label htmlFor="phone" style={{ fontWeight: 600 }}>
          연락처
        </label>
        <input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="010-0000-0000"
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
        />

        <label htmlFor="address" style={{ fontWeight: 600 }}>
          주소
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
        />

        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
        {success && <p style={{ color: '#16a34a' }}>{success}</p>}

        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? '가입 처리 중...' : '회원가입'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        이미 계정이 있으신가요? <Link to="/login">로그인하기</Link>
      </p>
    </div>
  )
}

export default Register
