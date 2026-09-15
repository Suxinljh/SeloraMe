const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const users = db.collection('users')

const failure = (stage, error) => {
  const errCode = error && (error.errCode || error.errno || error.code)
  const errMsg = error && (error.errMsg || error.message)
  // Never log phoneCode, phoneInfo, OpenID, or any other personal data.
  console.error('loginWithPhone failed', { stage, errCode, errMsg })
  const safeError = new Error(`LOGIN_${stage}_FAILED`)
  safeError.errCode = errCode
  throw safeError
}

exports.main = async (event) => {
  const phoneCode = event && event.phoneCode
  if (typeof phoneCode !== 'string' || phoneCode.length === 0) {
    throw new Error('缺少手机号验证令牌')
  }

  try {
    // This consumes the short-lived phone code inside the trusted cloud runtime.
    // Do not return the phone number, session_key, or WeChat access token to clients.
    await cloud.openapi.phonenumber.getPhoneNumber({ code: phoneCode })
  } catch (error) {
    failure('PHONE_VERIFY', error)
  }

  try {
    const { OPENID } = cloud.getWXContext()
    const existing = await users.where({ _openid: OPENID }).limit(1).get()
    const user = existing.data[0]
    if (user) return { userId: user._id, nickName: user.nickName || 'SeloraMe 用户' }

    const created = await users.add({
      data: {
        nickName: 'SeloraMe 用户',
        createdAt: db.serverDate(),
        updatedAt: db.serverDate(),
      },
    })
    return { userId: created._id, nickName: 'SeloraMe 用户' }
  } catch (error) {
    failure('USER_STORE', error)
  }
}
