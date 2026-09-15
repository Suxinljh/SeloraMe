import './styles/index.scss'
import type { PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'

Taro.cloud.init({
  env: 'cloud1-9gl4yyr25a874f3c',
  traceUser: true,
})

export default function App({ children }: PropsWithChildren) {
  return children
}
