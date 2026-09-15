const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const users = db.collection('users')

exports.main = async (event) => {
  const nickName = typeof event?.nickName === 'string' ? event.nickName.trim() : ''
  const avatarUrl = typeof event?.avatarFileId === 'string' ? event.avatarFileId : ''
  if (!nickName) throw new Error('请填写昵称')

  const { OPENID } = cloud.getWXContext()
  const existing = await users.where({ _openid: OPENID }).limit(1).get()
  const data = { nickName, updatedAt: db.serverDate() }
  if (avatarUrl) data.avatarUrl = avatarUrl

  if (existing.data[0]) {
    const user = existing.data[0]
    await users.doc(user._id).update({ data })
    return { userId: user._id, nickName, avatarUrl: avatarUrl || user.avatarUrl || '' }
  }

  const created = await users.add({ data: { ...data, avatarUrl, createdAt: db.serverDate() } })
  return { userId: created._id, nickName, avatarUrl }
}
