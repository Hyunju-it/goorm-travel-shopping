import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  addCartItem,
  clearCart as clearCartRequest,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '../services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const LOCAL_STORAGE_KEY = 'travel_shop_guest_cart'

const initialState = {
  items: [],
  totalAmount: 0,
  totalQuantity: 0,
  isLoading: false,
  error: null,
}

function calculateTotals(items) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + Number(item.subtotal || item.price * item.quantity), 0)
  return {
    totalQuantity,
    totalAmount,
  }
}

function readGuestCart() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!stored) {
      return []
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error('게스트 장바구니 로드 오류:', error)
    return []
  }
}

function writeGuestCart(items) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('게스트 장바구니 저장 오류:', error)
  }
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [state, setState] = useState(initialState)

  useEffect(() => {
    loadCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const loadCart = async () => {
    if (isAuthenticated) {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))
        const response = await fetchCart()
        const { totalAmount, totalQuantity } = calculateTotals(response.items)
        setState({
          items: response.items,
          totalAmount,
          totalQuantity,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false, error: error.message || '장바구니를 불러오지 못했습니다.' }))
      }
    } else {
      const guestItems = readGuestCart()
      const { totalAmount, totalQuantity } = calculateTotals(guestItems)
      setState({
        items: guestItems,
        totalAmount,
        totalQuantity,
        isLoading: false,
        error: null,
      })
    }
  }

  const addToCart = async (product, quantity = 1) => {
    if (!product?.id) {
      return { success: false, error: '상품 정보가 올바르지 않습니다.' }
    }

    if (!isAuthenticated) {
      const guestItems = readGuestCart()
      const existingIndex = guestItems.findIndex((item) => item.id === product.id)
      if (existingIndex >= 0) {
        guestItems[existingIndex].quantity += quantity
        guestItems[existingIndex].subtotal = guestItems[existingIndex].price * guestItems[existingIndex].quantity
      } else {
        guestItems.push({
          id: product.id,
          name: product.name,
          price: Number(product.effectivePrice || product.price || 0),
          quantity,
          imageUrl: product.mainImageUrl,
          subtotal: Number(product.effectivePrice || product.price || 0) * quantity,
        })
      }
      writeGuestCart(guestItems)
      setState((prev) => {
        const updated = calculateTotals(guestItems)
        return {
          ...prev,
          items: guestItems,
          totalAmount: updated.totalAmount,
          totalQuantity: updated.totalQuantity,
        }
      })
      return { success: true }
    }

    try {
      await addCartItem(product.id, quantity)
      await loadCart()
      return { success: true }
    } catch (error) {
      const message = error.message || '장바구니에 담는 중 오류가 발생했습니다.'
      setState((prev) => ({ ...prev, error: message }))
      return { success: false, error: message }
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) {
      const guestItems = readGuestCart()
      const updatedItems = guestItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity, subtotal: item.price * quantity }
            : item
        )
        .filter((item) => item.quantity > 0)
      writeGuestCart(updatedItems)
      const { totalAmount, totalQuantity } = calculateTotals(updatedItems)
      setState((prev) => ({ ...prev, items: updatedItems, totalAmount, totalQuantity }))
      return
    }

    try {
      await updateCartItem(productId, quantity)
      await loadCart()
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message || '수량 변경에 실패했습니다.' }))
    }
  }

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      const guestItems = readGuestCart().filter((item) => item.id !== productId)
      writeGuestCart(guestItems)
      const { totalAmount, totalQuantity } = calculateTotals(guestItems)
      setState((prev) => ({ ...prev, items: guestItems, totalAmount, totalQuantity }))
      return
    }

    try {
      await removeCartItem(productId)
      await loadCart()
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message || '상품 제거에 실패했습니다.' }))
    }
  }

  const clearCart = async () => {
    if (!isAuthenticated) {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      setState(initialState)
      return
    }

    try {
      await clearCartRequest()
      setState(initialState)
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message || '장바구니 비우기에 실패했습니다.' }))
    }
  }

  const value = useMemo(
    () => ({
      items: state.items,
      totalAmount: state.totalAmount,
      totalQuantity: state.totalQuantity,
      isLoading: state.isLoading,
      error: state.error,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      reload: loadCart,
    }),
    [state]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
