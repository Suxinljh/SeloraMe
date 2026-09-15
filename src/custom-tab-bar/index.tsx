import { Component } from 'react'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Icon, { type IconName } from '../components/Icon'
import './index.scss'

const tabs: Array<{ icon: IconName; iconClass: string; label: string; path: string }> = [
  { icon: 'home', iconClass: 'tab-icon-home', label: '首页', path: '/pages/home/index' },
  { icon: 'gridView', iconClass: 'tab-icon-categories', label: '分类', path: '/pages/categories/index' },
  { icon: 'accountCircle', iconClass: 'tab-icon-profile', label: '我的', path: '/pages/profile/index' }
]

export default class CustomTabBar extends Component<unknown, { selected: number }> {
  static options = { addGlobalClass: true }

  state = { selected: 0 }

  setSelected = (selected: number) => this.setState({ selected })

  switchTab = (selected: number, url: string) => {
    this.setSelected(selected)
    Taro.switchTab({ url })
  }

  render () {
    const { selected } = this.state
    return <View className='custom-tabbar'>
      {tabs.map((tab, index) => <View key={tab.path} className={`custom-tabbar-item ${selected === index ? 'is-active' : ''}`} onClick={() => this.switchTab(index, tab.path)}>
        <View className='custom-tabbar-icon-wrap'><Icon name={tab.icon} className={`custom-tabbar-icon ${tab.iconClass}`} /></View>
        <Text className='custom-tabbar-label'>{tab.label}</Text>
      </View>)}
    </View>
  }
}
