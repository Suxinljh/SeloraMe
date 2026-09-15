import { Button, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Icon from '../../components/Icon'
import Nav from '../../components/Nav'
import { getCurrentUser, logout } from '../../store/auth'

export default function Settings () {
  const user = getCurrentUser()
  const leave = async () => {
    if (!user) return
    const result = await Taro.showModal({
      title: '退出登录',
      content: '退出后将清除本机保存的头像、昵称和登录状态。',
      confirmText: '退出登录',
      confirmColor: '#5a3bce'
    })
    if (!result.confirm) return
    logout()
    Taro.showToast({ title: '已退出登录', icon: 'success' })
    Taro.reLaunch({ url: '/pages/profile/index' })
  }

  return <View className='settings-page'>
    <Nav back light />
    <View className='settings-content'>
      <Text className='settings-title'>设置与隐私</Text>
      <Text className='settings-label'>账号</Text>
      <View className='settings-card'>
        <View className='settings-account'>
          <Icon name='accountCircle' className='settings-account-icon' />
          <View><Text className='settings-account-name'>{user?.nickName || '未登录'}</Text><Text className='settings-account-id'>{user ? `ID: ${user.userId}` : '登录后可查看个人资料'}</Text></View>
        </View>
      </View>
      <Text className='settings-label'>隐私与安全</Text>
      <View className='settings-card settings-row'><Text>个人信息与隐私说明</Text><Icon name='chevronRight' className='row-chevron' /></View>
      {user && <Button className='logout-button' onClick={leave}><Icon name='logout' className='logout-icon' />退出登录</Button>}
    </View>
  </View>
}
