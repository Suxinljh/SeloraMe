import Taro from '@tarojs/taro'

export type PhqSession = { answers: Array<number | null>; impact: number | null; completedAt: number | null }
const key = 'selorme-phq-9-session'
const emptySession = (): PhqSession => ({ answers: Array<number | null>(9).fill(null), impact: null, completedAt: null })

export function getPhqSession(): PhqSession {
  const stored = Taro.getStorageSync<Partial<PhqSession>>(key)
  if (!stored || !Array.isArray(stored.answers) || stored.answers.length !== 9) return emptySession()
  return { answers: stored.answers, impact: typeof stored.impact === 'number' ? stored.impact : null, completedAt: typeof stored.completedAt === 'number' ? stored.completedAt : null }
}

function save(session: PhqSession) { Taro.setStorageSync(key, session) }

export function savePhqAnswer(index: number, answer: number) {
  const session = getPhqSession(); session.answers[index] = answer; save(session)
}
export function savePhqImpact(impact: number) { const session = getPhqSession(); session.impact = impact; save(session) }
export function completePhqSession() { const session = getPhqSession(); session.completedAt = Date.now(); save(session) }
export function resetPhqSession() { save(emptySession()) }

export type GadSession = { answers: Array<number | null>; completedAt: number | null }
const gadKey = 'selorme-gad-7-session'
const emptyGadSession = (): GadSession => ({ answers: Array<number | null>(7).fill(null), completedAt: null })
export function getGadSession(): GadSession {
  const stored = Taro.getStorageSync<Partial<GadSession>>(gadKey)
  if (!stored || !Array.isArray(stored.answers) || stored.answers.length !== 7) return emptyGadSession()
  return { answers: stored.answers, completedAt: typeof stored.completedAt === 'number' ? stored.completedAt : null }
}
export function saveGadAnswer(index: number, answer: number) { const session = getGadSession(); session.answers[index] = answer; Taro.setStorageSync(gadKey, session) }
export function completeGadSession() { const session = getGadSession(); session.completedAt = Date.now(); Taro.setStorageSync(gadKey, session) }
export function resetGadSession() { Taro.setStorageSync(gadKey, emptyGadSession()) }
