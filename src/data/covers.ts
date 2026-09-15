/**
 * 量表封面图。
 *
 * 图片存放于 R2 对象存储，经 https://app.ljhsu.xin/selorame/ 提供。
 *
 * 注意：
 * - 微信小程序加载网络图片要求 HTTPS，且域名需在小程序后台配置为
 *   downloadFile 合法域名，否则正式环境不会加载。
 * - 未配置封面的量表 coverFor 返回 undefined，页面需自行降级（不渲染图片区域）。
 */

const R2_BASE = 'https://app.ljhsu.xin/selorame/'

/** 只存放实际存在文件的文件名，避免拼出不存在的 URL */
const coverFiles: Record<string, string> = {
  // 星光草丛中的回响，对应内耗与自我对话
  'internal-friction': 'seloramedataimg-1.webp',
  // 星空与梦境，对应内在思维方式的探索
  'learning-style': 'seloramedataimg-2.webp',
  // 花田小径通向远方，对应学业与专业方向的选择
  'major-choice': 'seloramedataimg-3.webp',
  // 森林暖阳，对应整体心理健康状态
  'college-mental': 'seloramedataimg-4.webp',
  // 同伴同行，对应儿少阶段的伙伴关系
  'adolescent-mental': 'seloramedataimg-5.webp',
  // 樱花雨中的安静，对应低落情绪
  'phq-9': 'seloramedataimg-6.webp',
  // 秋林与鹿的亲近，对应对亲密关系的依恋
  attachment: 'seloramedataimg-7.webp',
  // 窗边阅读的日常，对应学习与作息习惯
  'study-habit': 'seloramedataimg-8.webp',
  // 雨中荷塘的静坐，对应焦虑的安抚
  gad: 'seloramedataimg-9.webp',
  // 花田中的活力人群，对应人格类型
  mbti: 'seloramedataimg-mbti-10.webp',
  // 四人俯视图，对应四型人格模型
  disc: 'seloramedataimg-mbti-11.webp',
}

/** 取量表封面图 URL，无封面时返回 undefined */
export const coverFor = (scaleId: string): string | undefined => {
  const file = coverFiles[scaleId]
  return file ? `${R2_BASE}${file}` : undefined
}

/** 已配置封面的量表 id，供列表页筛选使用 */
export const coveredScaleIds = (): string[] => Object.keys(coverFiles)

/** 封面图基址，供后续扩展或调试 */
export const coverBaseUrl = R2_BASE
