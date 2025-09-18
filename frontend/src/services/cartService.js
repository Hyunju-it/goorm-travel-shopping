import apiClient from './apiClient'

export async function fetchCart() {
  const response = await apiClient.get('/cart')
  return response.data
}

export async function addCartItem(productId, quantity = 1) {
  const response = await apiClient.post('/cart', { productId, quantity })
  return response.data
}

export async function updateCartItem(productId, quantity) {
  const response = await apiClient.put(`/cart/${productId}`, { quantity })
  return response.data
}

export async function removeCartItem(productId) {
  await apiClient.delete(`/cart/${productId}`)
}

export async function clearCart() {
  await apiClient.delete('/cart')
}
