import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { fetchAllOrders, updateOrderStatus } from '../services/orderService'
import {
  createProduct,
  deleteProduct,
  fetchAdminProduct,
  fetchAdminProducts,
  fetchCategories,
  updateProduct,
} from '../services/productService'

const ORDER_STATUSES = [
  'ORDER_PLACED',
  'PAYMENT_COMPLETED',
  'PREPARING',
  'SHIPPED',
  'DELIVERED',
  'CANCELED',
  'RETURNED',
]

const PAYMENT_STATUSES = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']

const PRODUCT_STATUSES = ['DRAFT', 'ACTIVE', 'INACTIVE', 'DISCONTINUED']

const INITIAL_PRODUCT_FORM = {
  categoryId: '',
  name: '',
  shortDescription: '',
  description: '',
  price: '',
  salePrice: '',
  stockQuantity: '',
  mainImageUrl: '',
  status: 'ACTIVE',
  images: [],
}

function Admin() {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('orders')

  // 주문 관리 상태
  const [orders, setOrders] = useState([])
  const [orderStatusSelections, setOrderStatusSelections] = useState({})
  const [orderPaymentSelections, setOrderPaymentSelections] = useState({})
  const [orderFeedback, setOrderFeedback] = useState(null)
  const [orderLoading, setOrderLoading] = useState(false)

  // 상품 관리 상태
  const [products, setProducts] = useState([])
  const [productStatusFilter, setProductStatusFilter] = useState('')
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [productFeedback, setProductFeedback] = useState(null)
  const [productError, setProductError] = useState(null)
  const [productLoading, setProductLoading] = useState(false)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [productModalMode, setProductModalMode] = useState('create')
  const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [productDetailLoading, setProductDetailLoading] = useState(false)
  const [categories, setCategories] = useState([])

  const isAdmin = isAuthenticated && user?.role === 'ADMIN'

  useEffect(() => {
    if (!isAdmin) {
      return
    }

    async function loadCategories() {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (error) {
        console.error('카테고리 로드 실패', error)
      }
    }

    loadCategories()
  }, [isAdmin])

  useEffect(() => {
    if (!isAdmin || activeTab !== 'orders') {
      return
    }

    async function loadOrders() {
      try {
        setOrderLoading(true)
        setOrderFeedback(null)
        const data = await fetchAllOrders()
        setOrders(data)
      } catch (error) {
        setOrderFeedback({ type: 'danger', message: error.message || '주문 목록을 불러오지 못했습니다.' })
      } finally {
        setOrderLoading(false)
      }
    }

    loadOrders()
  }, [isAdmin, activeTab])

  useEffect(() => {
    if (!isAdmin || activeTab !== 'products') {
      return
    }

    async function loadProducts() {
      try {
        setProductLoading(true)
        setProductError(null)
        const params = {}
        if (productStatusFilter) {
          params.status = productStatusFilter
        }
        const data = await fetchAdminProducts(params)
        setProducts(data)
      } catch (error) {
        setProductError(error.message || '상품 목록을 불러오지 못했습니다.')
      } finally {
        setProductLoading(false)
      }
    }

    loadProducts()
  }, [isAdmin, activeTab, productStatusFilter])

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <p>관리자 권한이 필요한 페이지입니다.</p>
      </div>
    )
  }

  const handleOrderStatusChange = (orderNumber, value) => {
    setOrderStatusSelections((prev) => ({ ...prev, [orderNumber]: value }))
  }

  const handleOrderPaymentChange = (orderNumber, value) => {
    setOrderPaymentSelections((prev) => ({ ...prev, [orderNumber]: value }))
  }

  const handleOrderUpdate = async (orderNumber) => {
    if (!orderStatusSelections[orderNumber] && !orderPaymentSelections[orderNumber]) {
      setOrderFeedback({ type: 'danger', message: '변경할 상태를 선택해 주세요.' })
      return
    }

    try {
      await updateOrderStatus(orderNumber, {
        status: orderStatusSelections[orderNumber] || null,
        paymentStatus: orderPaymentSelections[orderNumber] || null,
      })
      setOrderFeedback({ type: 'success', message: `${orderNumber} 주문 상태가 갱신되었습니다.` })
      const refreshed = await fetchAllOrders()
      setOrders(refreshed)
    } catch (error) {
      setOrderFeedback({ type: 'danger', message: error.message || '주문 상태 갱신에 실패했습니다.' })
    }
  }

  const filteredProducts = useMemo(() => {
    if (!productSearchTerm) {
      return products
    }
    const keyword = productSearchTerm.toLowerCase()
    return products.filter((product) => {
      const target = `${product.name} ${product.shortDescription || ''} ${product.description || ''}`.toLowerCase()
      return target.includes(keyword)
    })
  }, [products, productSearchTerm])

  const openProductModal = (mode = 'create') => {
    setProductModalMode(mode)
    setProductFeedback(null)
    setProductError(null)
    if (mode === 'create') {
      setProductForm({ ...INITIAL_PRODUCT_FORM, status: 'ACTIVE', images: [] })
      setSelectedProductId(null)
      setProductModalOpen(true)
    }
  }

  const openEditProductModal = async (productId) => {
    setProductModalMode('edit')
    setProductFeedback(null)
    setProductError(null)
    setSelectedProductId(productId)
    setProductDetailLoading(true)
    setProductModalOpen(true)

    try {
      const data = await fetchAdminProduct(productId)
      setProductForm({
        categoryId: data.categoryId ? String(data.categoryId) : '',
        name: data.name || '',
        shortDescription: data.shortDescription || '',
        description: data.description || '',
        price: data.price != null ? Number(data.price).toString() : '',
        salePrice: data.salePrice != null ? Number(data.salePrice).toString() : '',
        stockQuantity: data.stockQuantity != null ? Number(data.stockQuantity).toString() : '',
        mainImageUrl: data.mainImageUrl || '',
        status: data.status || 'ACTIVE',
        images: (data.images || []).map((image) => ({
          imageUrl: image.imageUrl || '',
          altText: image.altText || '',
          sortOrder: image.sortOrder != null ? Number(image.sortOrder).toString() : '',
          main: Boolean(image.main),
        })),
      })
    } catch (error) {
      setProductError(error.message || '상품 정보를 불러오지 못했습니다.')
    } finally {
      setProductDetailLoading(false)
    }
  }

  const closeProductModal = () => {
    setProductModalOpen(false)
    setSelectedProductId(null)
    setProductDetailLoading(false)
    setProductForm(INITIAL_PRODUCT_FORM)
  }

  const handleProductFormChange = (event) => {
    const { name, value } = event.target
    setProductForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductImageChange = (index, field, value) => {
    setProductForm((prev) => {
      const images = [...prev.images]
      images[index] = { ...images[index], [field]: value }
      return { ...prev, images }
    })
  }

  const addProductImageField = () => {
    setProductForm((prev) => ({
      ...prev,
      images: [...prev.images, { imageUrl: '', altText: '', sortOrder: '', main: prev.images.length === 0 }],
    }))
  }

  const removeProductImageField = (index) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault()

    const priceValue = Number(productForm.price)
    const stockValue = Number.parseInt(productForm.stockQuantity, 10)
    const saleValue = productForm.salePrice ? Number(productForm.salePrice) : null

    if (Number.isNaN(priceValue) || priceValue <= 0) {
      setProductFeedback({ type: 'danger', message: '상품 가격을 정확히 입력해 주세요.' })
      return
    }

    if (Number.isNaN(stockValue) || stockValue < 1) {
      setProductFeedback({ type: 'danger', message: '재고 수량은 1 이상이어야 합니다.' })
      return
    }

    const payload = {
      categoryId: Number(productForm.categoryId),
      name: productForm.name,
      shortDescription: productForm.shortDescription || null,
      description: productForm.description || null,
      price: priceValue,
      salePrice: saleValue || null,
      stockQuantity: stockValue,
      mainImageUrl: productForm.mainImageUrl || null,
      status: productForm.status,
      images: (productForm.images || [])
        .filter((image) => image.imageUrl && image.imageUrl.trim())
        .map((image, index) => ({
          imageUrl: image.imageUrl.trim(),
          altText: image.altText || null,
          sortOrder: image.sortOrder ? Number(image.sortOrder) : index,
          main: Boolean(image.main),
        })),
    }

    try {
      setProductFeedback(null)
      if (productModalMode === 'edit' && selectedProductId) {
        await updateProduct(selectedProductId, payload)
        setProductFeedback({ type: 'success', message: '상품이 수정되었습니다.' })
      } else {
        await createProduct(payload)
        setProductFeedback({ type: 'success', message: '상품이 등록되었습니다.' })
      }
      closeProductModal()
      const params = productStatusFilter ? { status: productStatusFilter } : {}
      const data = await fetchAdminProducts(params)
      setProducts(data)
    } catch (error) {
      setProductFeedback({ type: 'danger', message: error.message || '상품 저장에 실패했습니다.' })
    }
  }

  const handleProductDelete = async (productId) => {
    const confirmed = window.confirm('정말로 이 상품을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.')
    if (!confirmed) {
      return
    }

    try {
      await deleteProduct(productId)
      setProductFeedback({ type: 'success', message: '상품이 삭제되었습니다.' })
      const params = productStatusFilter ? { status: productStatusFilter } : {}
      const data = await fetchAdminProducts(params)
      setProducts(data)
    } catch (error) {
      setProductFeedback({ type: 'danger', message: error.message || '상품 삭제에 실패했습니다.' })
    }
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>관리자 센터</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          주문 관리
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('products')}
        >
          상품 관리
        </button>
      </div>

      {activeTab === 'orders' && (
        <section>
          {orderFeedback && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: orderFeedback.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: orderFeedback.type === 'success' ? '#166534' : '#b91c1c',
              }}
            >
              {orderFeedback.message}
            </div>
          )}

          {orderLoading ? (
            <p>주문을 불러오는 중입니다...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((order) => (
                <div key={order.orderNumber} className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{order.orderNumber}</h2>
                      <p style={{ color: 'var(--gray-600)' }}>주문일: {new Date(order.orderDate).toLocaleString()}</p>
                      <p style={{ color: 'var(--gray-600)' }}>현재 상태: {order.status}</p>
                      <p style={{ color: 'var(--gray-600)' }}>결제 상태: {order.paymentStatus}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 'bold' }}>총액 ₩{Number(order.finalAmount || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label htmlFor={`status-${order.orderNumber}`}>주문 상태</label>
                      <select
                        id={`status-${order.orderNumber}`}
                        value={orderStatusSelections[order.orderNumber] || ''}
                        onChange={(event) => handleOrderStatusChange(order.orderNumber, event.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                      >
                        <option value="">변경 없음</option>
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`payment-${order.orderNumber}`}>결제 상태</label>
                      <select
                        id={`payment-${order.orderNumber}`}
                        value={orderPaymentSelections[order.orderNumber] || ''}
                        onChange={(event) => handleOrderPaymentChange(order.orderNumber, event.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                      >
                        <option value="">변경 없음</option>
                        {PAYMENT_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button className="btn btn-primary" type="button" onClick={() => handleOrderUpdate(order.orderNumber)}>
                        상태 업데이트
                      </button>
                    </div>
                  </div>

                  <ul style={{ marginTop: '1rem', paddingLeft: '1.25rem', color: 'var(--gray-700)' }}>
                    {order.items?.map((item) => (
                      <li key={item.productId}>
                        {item.productName} &times; {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'products' && (
        <section>
          {productFeedback && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: productFeedback.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: productFeedback.type === 'success' ? '#166534' : '#b91c1c',
              }}
            >
              {productFeedback.message}
            </div>
          )}

          {productError && (
            <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
              {productError}
            </div>
          )}

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <select
                value={productStatusFilter}
                onChange={(event) => setProductStatusFilter(event.target.value)}
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
              >
                <option value="">전체 상태</option>
                {PRODUCT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <input
                type="search"
                placeholder="상품명, 설명 검색"
                value={productSearchTerm}
                onChange={(event) => setProductSearchTerm(event.target.value)}
                style={{ flex: '1 1 200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
              />

              <button className="btn btn-primary" type="button" onClick={() => openProductModal('create')}>
                새 상품 등록
              </button>
            </div>

            {productLoading ? (
              <p>상품을 불러오는 중입니다...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--gray-100)' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>상품명</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>상태</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>가격</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>재고</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>카테고리</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem' }}>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} style={{ borderTop: '1px solid var(--gray-200)' }}>
                        <td style={{ padding: '0.75rem' }}>{product.name}</td>
                        <td style={{ padding: '0.75rem' }}>{product.status || 'ACTIVE'}</td>
                        <td style={{ padding: '0.75rem' }}>₩{Number(product.effectivePrice || product.price || 0).toLocaleString()}</td>
                        <td style={{ padding: '0.75rem' }}>{product.stockQuantity ?? '-'}</td>
                        <td style={{ padding: '0.75rem' }}>{product.categoryName || '-'}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button className="btn btn-secondary" type="button" onClick={() => openEditProductModal(product.id)}>
                            수정
                          </button>
                          <button className="btn btn-text" type="button" onClick={() => handleProductDelete(product.id)}>
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '1rem', textAlign: 'center', color: 'var(--gray-600)' }}>
                          표시할 상품이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {productModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem',
          }}
        >
          <div className="card" style={{ maxWidth: '640px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{productModalMode === 'edit' ? '상품 수정' : '새 상품 등록'}</h2>
              <button className="btn btn-text" type="button" onClick={closeProductModal}>
                닫기
              </button>
            </div>

            {productDetailLoading ? (
              <p>상품 정보를 불러오는 중입니다...</p>
            ) : (
              <form onSubmit={handleProductSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label htmlFor="categoryId" style={{ fontWeight: 600 }}>카테고리</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={productForm.categoryId}
                    onChange={handleProductFormChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                  >
                    <option value="">카테고리를 선택하세요</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="name" style={{ fontWeight: 600 }}>상품명</label>
                  <input
                    id="name"
                    name="name"
                    value={productForm.name}
                    onChange={handleProductFormChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                  />
                </div>

                <div>
                  <label htmlFor="shortDescription" style={{ fontWeight: 600 }}>짧은 설명</label>
                  <input
                    id="shortDescription"
                    name="shortDescription"
                    value={productForm.shortDescription}
                    onChange={handleProductFormChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                  />
                </div>

                <div>
                  <label htmlFor="description" style={{ fontWeight: 600 }}>상세 설명</label>
                  <textarea
                    id="description"
                    name="description"
                    value={productForm.description}
                    onChange={handleProductFormChange}
                    rows={4}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label htmlFor="price" style={{ fontWeight: 600 }}>가격</label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="1000"
                      value={productForm.price}
                      onChange={handleProductFormChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="salePrice" style={{ fontWeight: 600 }}>할인 가격</label>
                    <input
                      id="salePrice"
                      name="salePrice"
                      type="number"
                      min="0"
                      step="1000"
                      value={productForm.salePrice}
                      onChange={handleProductFormChange}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="stockQuantity" style={{ fontWeight: 600 }}>재고</label>
                    <input
                      id="stockQuantity"
                      name="stockQuantity"
                      type="number"
                      min="1"
                      value={productForm.stockQuantity}
                      onChange={handleProductFormChange}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="status" style={{ fontWeight: 600 }}>상태</label>
                    <select
                      id="status"
                      name="status"
                      value={productForm.status}
                      onChange={handleProductFormChange}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                    >
                      {PRODUCT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="mainImageUrl" style={{ fontWeight: 600 }}>대표 이미지 URL</label>
                  <input
                    id="mainImageUrl"
                    name="mainImageUrl"
                    value={productForm.mainImageUrl}
                    onChange={handleProductFormChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>추가 이미지</h3>
                    <button className="btn btn-secondary" type="button" onClick={addProductImageField}>
                      이미지 추가
                    </button>
                  </div>

                  {productForm.images.length === 0 && (
                    <p style={{ marginTop: '0.5rem', color: 'var(--gray-600)' }}>추가 이미지를 등록하지 않아도 됩니다.</p>
                  )}

                  <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.75rem' }}>
                    {productForm.images.map((image, index) => (
                      <div key={index} className="card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
                          <input
                            placeholder="이미지 URL"
                            value={image.imageUrl}
                            onChange={(event) => handleProductImageChange(index, 'imageUrl', event.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                          />
                          <input
                            placeholder="대체 텍스트"
                            value={image.altText}
                            onChange={(event) => handleProductImageChange(index, 'altText', event.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                          />
                          <input
                            placeholder="정렬 순서"
                            type="number"
                            min="0"
                            value={image.sortOrder}
                            onChange={(event) => handleProductImageChange(index, 'sortOrder', event.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                          />
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(image.main)}
                              onChange={(event) => handleProductImageChange(index, 'main', event.target.checked)}
                            />
                            대표 이미지로 표시
                          </label>
                          <button className="btn btn-text" type="button" onClick={() => removeProductImageField(index)}>
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button className="btn btn-secondary" type="button" onClick={closeProductModal}>
                    취소
                  </button>
                  <button className="btn btn-primary" type="submit">
                    {productModalMode === 'edit' ? '상품 수정' : '상품 등록'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
