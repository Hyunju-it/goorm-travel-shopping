import apiClient from './apiClient'

export async function fetchCategories() {
  const response = await apiClient.get('/categories')
  return response.data
}

export async function fetchProducts(params = {}) {
  const response = await apiClient.get('/products', { params })
  return response.data
}

export async function fetchProductDetail(productId) {
  const response = await apiClient.get(`/products/${productId}`)
  return response.data
}

export async function fetchAdminProducts(params = {}) {
  const response = await apiClient.get('/admin/products', { params })
  return response.data
}

export async function fetchAdminProduct(productId) {
  const response = await apiClient.get(`/admin/products/${productId}`)
  return response.data
}

export async function createProduct(payload) {
  const response = await apiClient.post('/admin/products', payload)
  return response.data
}

export async function updateProduct(productId, payload) {
  const response = await apiClient.put(`/admin/products/${productId}`, payload)
  return response.data
}

export async function deleteProduct(productId) {
  await apiClient.delete(`/admin/products/${productId}`)
}
