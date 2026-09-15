import Taro from '@tarojs/taro'

type CustomTabBarInstance = { setSelected: (selected: number) => void }

export const setActiveTab = (selected: number) => {
  const page = Taro.getCurrentInstance().page
  const tabBar = page ? Taro.getTabBar<CustomTabBarInstance>(page) : null
  tabBar?.setSelected(selected)
}
