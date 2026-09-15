import Taro from '@tarojs/taro'

const storageKey = 'selorme-user'

export type SelormeUser = { avatarUrl: string; nickName: string; userId: string }
type CloudLoginResult = { userId?: unknown; nickName?: unknown; avatarUrl?: unknown }

export const getCurrentUser = (): SelormeUser | null => {
  const stored = Taro.getStorageSync(storageKey) as SelormeUser | ''
  return stored && stored.userId ? stored : null
}

export async function loginWithWechatProfile(nickName: string, avatarPath: string): Promise<SelormeUser> {
  let avatarFileId = ''
  if (avatarPath) {
    const extension = avatarPath.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'png'
    const upload = await Taro.cloud.uploadFile({
      cloudPath: `avatars/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`,
      filePath: avatarPath,
    })
    avatarFileId = upload.fileID
  }
  const response = await Taro.cloud.callFunction({ name: 'loginWithProfile', data: { nickName, avatarFileId } })
  const result = response.result as CloudLoginResult | undefined
  if (!result || typeof result.userId !== 'string' || typeof result.nickName !== 'string' || typeof result.avatarUrl !== 'string') {
    throw new Error('云函数未返回有效登录结果')
  }
  const user: SelormeUser = { userId: result.userId, nickName: result.nickName, avatarUrl: result.avatarUrl }
  Taro.setStorageSync(storageKey, user)
  return user
}

export const logout = () => Taro.removeStorageSync(storageKey)
