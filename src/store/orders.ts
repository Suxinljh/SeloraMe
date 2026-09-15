import Taro from '@tarojs/taro'

const purchaseOrderStorageKey = 'selorme-purchase-orders'

export type PurchaseOrder = {
  id: string
  assessmentId: string
  assessmentTitle: string
  createdAt: number
  quantity: number
  unitPrice: number
  discount: number
  totalPrice: number
}

const isPurchaseOrder = (value: unknown): value is PurchaseOrder => {
  if (!value || typeof value !== 'object') return false
  const order = value as Record<string, unknown>
  return typeof order.id === 'string' && typeof order.assessmentId === 'string' && typeof order.assessmentTitle === 'string'
    && typeof order.createdAt === 'number' && typeof order.quantity === 'number' && typeof order.unitPrice === 'number'
    && typeof order.discount === 'number' && typeof order.totalPrice === 'number'
}

export function getPurchaseOrders (): PurchaseOrder[] {
  const value = Taro.getStorageSync<unknown>(purchaseOrderStorageKey)
  return Array.isArray(value) ? value.filter(isPurchaseOrder).sort((first, second) => second.createdAt - first.createdAt) : []
}

export function getPurchaseOrder (orderId: string): PurchaseOrder | undefined {
  return getPurchaseOrders().find((order) => order.id === orderId)
}

export function savePurchaseOrder (order: PurchaseOrder): void {
  const orders = getPurchaseOrders().filter((item) => item.id !== order.id)
  Taro.setStorageSync(purchaseOrderStorageKey, [order, ...orders])
}
