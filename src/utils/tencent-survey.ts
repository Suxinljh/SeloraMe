import Taro from '@tarojs/taro'

/** 腾讯问卷小程序 AppID，官方固定值 */
const SURVEY_APP_ID = 'wxebadf544ddae62cb'

/**
 * 求测评问卷的分享链接，从腾讯问卷「分享 - 链接分享」复制过来即可，
 * 形如 https://wj.qq.com/s2/123456789/abcd/ ，sid 与 hash 会自动解析。
 * 留空时入口会提示未开放，不会跳到空白页。
 */
export const ASSESSMENT_REQUEST_LINK = 'https://wj.qq.com/s2/27913122/l074/'

/** 从分享链接里取出腾讯问卷需要的 sid 与 hash */
const parseShareLink = (link: string) => {
  const matched = /wj\.qq\.com\/s2\/(\d+)\/([0-9a-zA-Z]+)/.exec(link)
  return matched ? { sid: matched[1], hash: matched[2] } : null
}

/**
 * 半屏打开腾讯问卷答题。
 *
 * 用 openEmbeddedMiniProgram：没有「即将打开」确认弹窗，用户提交后会自动跳回本
 * 小程序，并在 App 的 onShow 里回传 status=answered。
 * 基础库过低或半屏权限未开通时，退回普通小程序跳转（会多一次确认弹窗）。
 *
 * @param link 问卷分享链接
 * @param userId 作为自定义参数带给问卷，后续可在问卷后台按账号关联数据
 */
export async function openSurvey (link: string, userId?: string): Promise<void> {
  const target = parseShareLink(link)
  if (!target) {
    Taro.showToast({ title: '问卷还没配置好，稍后再试', icon: 'none' })
    return
  }

  const query = [`sid=${target.sid}`, `hash=${target.hash}`, 'navigateBackMiniProgram=true']
  if (userId) query.push(`userid=${encodeURIComponent(userId)}`)
  const path = `pages/survey/index?${query.join('&')}`

  try {
    await Taro.openEmbeddedMiniProgram({ appId: SURVEY_APP_ID, path })
  } catch (error) {
    console.warn('SeloraMe 半屏打开问卷失败，退回普通跳转', error)
    try {
      await Taro.navigateToMiniProgram({ appId: SURVEY_APP_ID, path })
    } catch (fallbackError) {
      console.warn('SeloraMe 打开问卷失败', fallbackError)
      Taro.showToast({ title: '打开问卷失败，请稍后再试', icon: 'none' })
    }
  }
}
