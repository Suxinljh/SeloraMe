import { Button, Form, Image, Input, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import Nav from '../../components/Nav'
import Icon from '../../components/Icon'
import { loginWithWechatProfile } from '../../store/auth'

/**
 * 登录页。
 *
 * 微信现行规范下昵称与头像都必须由用户主动提供，所以走「点选头像 + 填写昵称」
 * 的显式表单，而不是旧版 getUserProfile 一键授权。
 *
 * 登录成功后返回上一页，用户可以直接继续刚才被守卫拦下的那一步操作。
 * 样式沿用样式表里既有的 .profile-login-* 与 .avatar 组合。
 */
export default function Login () {
  const [nickname, setNickname] = useState('')
  const [avatarPath, setAvatarPath] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const chooseAvatar = (event: { detail: { avatarUrl?: string } }) =>
    setAvatarPath(event.detail.avatarUrl || '')

  const submit = async (event: { detail: { value?: Record<string, unknown> } }) => {
    const submitted = event.detail.value?.nickname
    const nextNickname = (typeof submitted === 'string' ? submitted : nickname).trim()
    if (!nextNickname) {
      Taro.showToast({ title: '请填写昵称', icon: 'none' })
      return
    }
    if (submitting) return

    setSubmitting(true)
    try {
      await loginWithWechatProfile(nextNickname, avatarPath)
      Taro.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 600)
    } catch (error) {
      console.warn('SeloraMe login failed', error)
      Taro.showToast({ title: '登录失败，请重试', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  return <View className='page login-page'>
    <Nav back light />

    <View className='login-body'>
      <Text className='login-title'>登录 SeloraMe</Text>
      <Text className='login-desc'>登录后即可搜索测评、收藏量表、保存答题记录与查看专属报告</Text>

      <Form className='login-form' onSubmit={submit}>
        <View className='profile-login-form'>
          <Button
            className='profile-avatar-picker'
            openType='chooseAvatar'
            onChooseAvatar={chooseAvatar}
          >
            <View className='avatar'>
              {avatarPath
                ? <Image className='profile-avatar-preview' src={avatarPath} mode='aspectFill' />
                : <Icon name='accountCircle' className='profile-avatar-icon' />}
            </View>
          </Button>

          <View className='profile-login-row'>
            <Input
              className='profile-nickname-input'
              type='nickname'
              name='nickname'
              value={nickname}
              placeholder='填写昵称'
              onInput={(event) => setNickname(event.detail.value)}
            />
            <View className='profile-login-divider' />
            <Button className='profile-login-inline' formType='submit'>进入</Button>
          </View>
        </View>
      </Form>

      <Text className='login-note'>头像与昵称会保存到你的账号，仅用于页面展示</Text>
    </View>
  </View>
}
