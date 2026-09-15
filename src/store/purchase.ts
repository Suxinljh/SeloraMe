import Taro from '@tarojs/taro'
import type { Scale } from '../data/scales'

/**
 * 积分与报告解锁。
 *
 * 计价规则：1 积分 = 1 元。解锁一份详细报告所需积分等于该评测的标价数值，
 * 例如标价 ¥9.9 的评测需要 9.9 积分。未标价的评测免费，无需解锁。
 *
 * 当前只实现「余额 + 解锁记录」的本地存储与扣减逻辑；
 * 充值（微信支付等）尚未接入，接入后调用 addPoints 即可。
 */

const BALANCE_KEY = 'selorme-points-balance'
const UNLOCKED_KEY = 'selorme-unlocked-report-ids'

/** 从价格文案里取出数值，如 '¥9.9' → 9.9；无价格返回 0 */
export const pointsCostOf = (scale: Scale): number => {
  if (!scale.price) return 0
  const matched = scale.price.replace(/[^\d.]/g, '')
  const value = Number.parseFloat(matched)
  return Number.isFinite(value) ? value : 0
}

/** 该评测的详细报告是否需要付费解锁 */
export const requiresUnlock = (scale: Scale): boolean => pointsCostOf(scale) > 0

export function getPoints (): number {
  const stored = Taro.getStorageSync<unknown>(BALANCE_KEY)
  return typeof stored === 'number' && Number.isFinite(stored) ? stored : 0
}

/** 增加积分。返回值即充值后的余额 */
export function addPoints (amount: number): number {
  const next = Math.max(0, getPoints() + amount)
  Taro.setStorageSync(BALANCE_KEY, next)
  return next
}

export function getUnlockedReportIds (): string[] {
  const value = Taro.getStorageSync<unknown>(UNLOCKED_KEY)
  return Array.isArray(value) && value.every((id) => typeof id === 'string') ? value : []
}

/** 该评测的详细报告是否已解锁 */
export function isReportUnlocked (scaleId: string): boolean {
  return getUnlockedReportIds().includes(scaleId)
}

export type UnlockResult = 'unlocked' | 'already' | 'insufficient' | 'free'

/**
 * 解锁详细报告：扣减积分并永久记录。
 * 解锁记录写在本地，重新进入报告页依然视为已解锁。
 */
export function unlockReport (scale: Scale): UnlockResult {
  const cost = pointsCostOf(scale)
  if (cost <= 0) return 'free'
  if (isReportUnlocked(scale.id)) return 'already'

  const balance = getPoints()
  if (balance < cost) return 'insufficient'

  Taro.setStorageSync(BALANCE_KEY, Math.round((balance - cost) * 100) / 100)
  Taro.setStorageSync(UNLOCKED_KEY, [...getUnlockedReportIds(), scale.id])
  return 'unlocked'
}

/** 清空解锁记录与余额，供调试与「恢复初始状态」使用 */
export function resetPurchaseState () {
  Taro.removeStorageSync(BALANCE_KEY)
  Taro.removeStorageSync(UNLOCKED_KEY)
}

/** 已解锁的报告 id，供「已购测评」等聚合使用 */
export function getPurchasedAssessmentIds (): string[] {
  return getUnlockedReportIds()
}
