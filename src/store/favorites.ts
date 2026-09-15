import Taro from '@tarojs/taro'

const favoriteAssessmentStorageKey = 'selorme-favorite-assessment-ids'

export function getFavoriteAssessmentIds (): string[] {
  const value = Taro.getStorageSync<unknown>(favoriteAssessmentStorageKey)
  return Array.isArray(value) && value.every((id) => typeof id === 'string') ? value : []
}

export function isFavoriteAssessment (assessmentId: string): boolean {
  return getFavoriteAssessmentIds().includes(assessmentId)
}

export function toggleFavoriteAssessment (assessmentId: string): boolean {
  const ids = getFavoriteAssessmentIds()
  const isFavorite = ids.includes(assessmentId)
  Taro.setStorageSync(favoriteAssessmentStorageKey, isFavorite ? ids.filter((id) => id !== assessmentId) : [...ids, assessmentId])
  return !isFavorite
}
