import Taro from '@tarojs/taro'

const purchasedAssessmentStorageKey = 'selorme-purchased-assessment-ids'

export function getPurchasedAssessmentIds (): string[] {
  const value = Taro.getStorageSync<unknown>(purchasedAssessmentStorageKey)
  return Array.isArray(value) && value.every((id) => typeof id === 'string') ? value : []
}
