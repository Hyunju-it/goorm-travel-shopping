import apiClient from './apiClient'

export async function createOrder(payload) {
  const response = await apiClient.post('/orders', payload)
  return response.data
}

export async function fetchOrders() {
  const response = await apiClient.get('/orders')
  return response.data
}

export async function fetchAllOrders() {
  const response = await apiClient.get('/orders/admin/all')
  return response.data
}

export async function fetchOrderDetail(orderNumber) {
  const response = await apiClient.get(`/orders/${orderNumber}`)
  return response.data
}

export async function updateOrderStatus(orderNumber, payload) {
  await apiClient.patch(`/orders/${orderNumber}/status`, payload)
}
