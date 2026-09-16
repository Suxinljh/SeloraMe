import Taro from '@tarojs/taro'
import { getCurrentUser } from '../store/auth'

/** 登录页路径，守卫与「去登录」入口共用 */
export const LOGIN_PAGE = '/pages/login/index'

export const isLoggedIn = () => Boolean(getCurrentUser())

/**
 * 需要登录才能进行的操作，在入口处先过这一道。
 *
 * 未登录时弹确认框，用户确认后跳登录页；无论确认与否都返回 false，
 * 调用方据此直接 return，不要继续原来的跳转或写入。
 *
 * 用法：
 *   onClick={() => { if (!requireLogin('查看测评')) return; Taro.navigateTo(...) }}
 *
 * @param action 拼进提示语的操作名，如「搜索测评」「收藏量表」，说明登录能做什么
 */
export function requireLogin (action: string): boolean {
  if (isLoggedIn()) return true

  Taro.showModal({
    title: '登录后才能继续',
    content: `登录后即可${action}`,
    confirmText: '去登录',
    cancelText: '暂不',
    confirmColor: '#5a3bce',
  }).then((result) => {
    if (result.confirm) Taro.navigateTo({ url: LOGIN_PAGE })
  })

  return false
}
