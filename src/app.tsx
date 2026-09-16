import './styles/index.scss'
import type { PropsWithChildren } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'

Taro.cloud.init({
  env: 'cloud1-9gl4yyr25a874f3c',
  traceUser: true,
})

export default function App({ children }: PropsWithChildren) {
  /** 腾讯问卷答完会自动跳回本小程序，这里接住状态给一句反馈 */
  useDidShow((options) => {
    const extraData: unknown = options?.referrerInfo?.extraData
    if (typeof extraData !== 'object' || extraData === null) return
    if ('status' in extraData && extraData.status === 'answered') {
      Taro.showToast({ title: '已收到你的需求，感谢反馈', icon: 'none' })
    }
  })

  return children
}
