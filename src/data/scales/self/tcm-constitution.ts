import type { Scale } from '../types'

// 计分取值依据：源文本“每一问题按5级评分”，统一为 没有（根本不）=1、很少（有一点）=2、
// 有时（有些）=3、经常（相当）=4、总是（非常）=5。
// 反向计分：标有 * 的条目（仅平和质的第2、3、4、5、7、8题，即全局题号 2,3,4,5,7,8）
// 需先逆向计分（1→5,2→4,3→3,4→2,5→1），已标记 reverse:true。模型 reverse 计算
// （max+min-raw = 6-raw）与此一致。
// 判定方法（源文本）：原始分 = 各条目分之和；转化分 = [(原始分-条目数)/(条目数×4)]×100。
// 平和质为正常体质，其他8种为偏颇体质。平和质最终判定需结合其他8种体质转化分
// （均＜30为“是”，均＜40为“基本是”），本文件在 profileNote 中说明，维度 band 仅按
// 该体质自身转化分给出分级区间。源文本气虚质第（8）题“您活动量就容易出虚汗吗？”的
// 5级评分数字在提取中缺失，但该题属于标准5级题，选项与计分同本量表统一方案。
const scale: Scale = {
  id: 'tcm-constitution',
  title: '中医体质量表',
  desc: '辨识中医九种体质类型',
  category: 'self',
  duration: '约 12 分钟',
  tag: '国家标准',
  participants: '持续更新中',
  price: '¥9.9',
  intro: [
    '《中医体质分类与判定》标准由中华中医药学会编制，将体质分为平和质、气虚质、阳虚质、阴虚质、痰湿质、湿热质、血瘀质、气郁质、特禀质九种类型。',
    '请根据近一年的体验与感觉如实作答，每题按五级程度选择。',
  ],
  highlights: '67 题｜9 种体质｜转化分判定',
  benefits: [
    { title: '体质辨识', description: '了解自身属于哪种体质类型及其倾向。' },
    { title: '养生参考', description: '结果可作为日常饮食起居与养生调理的参考。' },
  ],
  instructions: [
    '每题按近一年的实际感受，在“没有～总是”五级中选择。',
    '回答所有题目，凭第一印象作答即可。',
  ],
  source: '《中医体质分类与判定》标准 · 中华中医药学会（2009）',
  options: [
    { label: '没有（根本不）', score: 1 },
    { label: '很少（有一点）', score: 2 },
    { label: '有时（有些）', score: 3 },
    { label: '经常（相当）', score: 4 },
    { label: '总是（非常）', score: 5 },
  ],
  questions: [
    { id: 1, text: '您精力充沛吗？', dimension: 'pinghe' },
    { id: 2, text: '您容易疲乏吗？', dimension: 'pinghe', reverse: true },
    { id: 3, text: '您说话声音无力吗？', dimension: 'pinghe', reverse: true },
    { id: 4, text: '您感到闷闷不乐吗？', dimension: 'pinghe', reverse: true },
    { id: 5, text: '您比一般人耐受不了寒冷（冬天的寒冷，夏天的冷空调、电扇）吗？', dimension: 'pinghe', reverse: true },
    { id: 6, text: '您能适应外界自然和社会环境的变化吗？', dimension: 'pinghe' },
    { id: 7, text: '您容易失眠吗？', dimension: 'pinghe', reverse: true },
    { id: 8, text: '您容易忘事（健忘）吗？', dimension: 'pinghe', reverse: true },
    { id: 9, text: '你容易疲乏吗？', dimension: 'qixu' },
    { id: 10, text: '您容易气短（呼吸短促，接不上气）吗？', dimension: 'qixu' },
    { id: 11, text: '您容易心慌吗？', dimension: 'qixu' },
    { id: 12, text: '您容易头晕或站起时晕眩吗？', dimension: 'qixu' },
    { id: 13, text: '您比别人容易患感冒吗？', dimension: 'qixu' },
    { id: 14, text: '您喜欢安静、懒得说话吗？', dimension: 'qixu' },
    { id: 15, text: '您说话声音无力吗？', dimension: 'qixu' },
    { id: 16, text: '您活动量就容易出虚汗吗？', dimension: 'qixu' },
    { id: 17, text: '您手脚发凉吗？', dimension: 'yangxu' },
    { id: 18, text: '您胃脘部、背部或腰膝部怕冷吗？', dimension: 'yangxu' },
    { id: 19, text: '您感到怕冷、衣服比别人穿得多吗？', dimension: 'yangxu' },
    { id: 20, text: '您比一般人不了寒冷（冬天的寒冷，夏天的冷空调、电扇等。', dimension: 'yangxu' },
    { id: 21, text: '您比别人容易患感冒吗？', dimension: 'yangxu' },
    { id: 22, text: '您吃（喝）凉的东西会感到不舒服或者怕吃（喝）凉东西吗？', dimension: 'yangxu' },
    { id: 23, text: '你受凉或吃（喝）凉的东西后，容易腹泻（拉肚子）吗？', dimension: 'yangxu' },
    { id: 24, text: '您感到手脚心发热吗？', dimension: 'yinxu' },
    { id: 25, text: '您感觉身体、脸上发热吗？', dimension: 'yinxu' },
    { id: 26, text: '您皮肤或口唇干吗？', dimension: 'yinxu' },
    { id: 27, text: '您口唇的颜色比一般人红吗？', dimension: 'yinxu' },
    { id: 28, text: '您容易便秘或大便干燥吗？', dimension: 'yinxu' },
    { id: 29, text: '您面部两潮红或偏红吗？', dimension: 'yinxu' },
    { id: 30, text: '您感到眼睛干涩吗？', dimension: 'yinxu' },
    { id: 31, text: '您活动量稍大就容易出虚汗吗？', dimension: 'yinxu' },
    { id: 32, text: '您感到胸闷或腹部胀满吗？', dimension: 'tanshi' },
    { id: 33, text: '您感到身体学生不轻松或不爽快吗？', dimension: 'tanshi' },
    { id: 34, text: '您腹部肥满松软吗？', dimension: 'tanshi' },
    { id: 35, text: '您有额部油脂分泌多的现象吗？', dimension: 'tanshi' },
    { id: 36, text: '您上眼睑比别人肿（仍轻微隆起的现象）吗？', dimension: 'tanshi' },
    { id: 37, text: '您嘴里有黏黏的感觉吗？', dimension: 'tanshi' },
    { id: 38, text: '您平时痰多，特别是咽喉部总感到有痰堵着吗？', dimension: 'tanshi' },
    { id: 39, text: '您舌苔厚腻或有舌苔厚厚的感觉吗？', dimension: 'tanshi' },
    { id: 40, text: '您面部或鼻部有油腻感或者油亮发光吗？', dimension: 'shire' },
    { id: 41, text: '你容易生痤疮或疮疖吗？', dimension: 'shire' },
    { id: 42, text: '您感到口苦或嘴里有异味吗？', dimension: 'shire' },
    { id: 43, text: '您大使黏滞不爽、有解不尽的感觉吗？', dimension: 'shire' },
    { id: 44, text: '您小便时尿道有发热感、尿色浓（深）吗？', dimension: 'shire' },
    { id: 45, text: '您带下色黄（白带颜色发黄）吗？（限女性回答）', dimension: 'shire' },
    { id: 46, text: '您的阴囊部位潮湿吗？', dimension: 'shire' },
    { id: 47, text: '您的皮肤在不知不觉中会出现青紫瘀斑（皮下出血）吗？', dimension: 'xueyu' },
    { id: 48, text: '您两颧部有细微红丝吗？', dimension: 'xueyu' },
    { id: 49, text: '您身体上有哪里疼痛吗？', dimension: 'xueyu' },
    { id: 50, text: '您面色晦黯或容易出现褐斑吗？', dimension: 'xueyu' },
    { id: 51, text: '您容易有黑眼圈吗？', dimension: 'xueyu' },
    { id: 52, text: '您容易忘事（健忘）吗？', dimension: 'xueyu' },
    { id: 53, text: '您口唇颜色偏黯吗？', dimension: 'xueyu' },
    { id: 54, text: '您感到闷闷不乐吗？', dimension: 'qiyu' },
    { id: 55, text: '您容易精神紧张、焦虑不安吗？', dimension: 'qiyu' },
    { id: 56, text: '您多愁善感、感情脆弱吗？', dimension: 'qiyu' },
    { id: 57, text: '您容易感到害怕或受到惊吓吗？', dimension: 'qiyu' },
    { id: 58, text: '您胁肋部或乳房腹痛吗？', dimension: 'qiyu' },
    { id: 59, text: '您无缘无故叹气吗？', dimension: 'qiyu' },
    { id: 60, text: '您咽喉部有异物感，且吐之不出、咽之不下吗？', dimension: 'qiyu' },
    { id: 61, text: '您没有感冒时也会打喷嚏吗？', dimension: 'tebing' },
    { id: 62, text: '您没有感冒时也会鼻塞、流鼻涕吗？', dimension: 'tebing' },
    { id: 63, text: '您有因季节变化、温度变化或异味等原因而咳喘的现象吗？', dimension: 'tebing' },
    { id: 64, text: '您容易过敏（对药物、食物、气味、花粉或在季节交替、气候变化时）吗？', dimension: 'tebing' },
    { id: 65, text: '您的皮肤容易起荨麻疹（风团、风疹块、风疙瘩）吗？', dimension: 'tebing' },
    { id: 66, text: '您的因过敏出现过紫癜（紫红色瘀点、瘀斑）吗？', dimension: 'tebing' },
    { id: 67, text: '您的皮肤一抓就红，并出现抓痕吗？', dimension: 'tebing' },
  ],
  dimensions: [
    {
      key: 'pinghe',
      name: '平和质（A型）',
      items: [1, 2, 3, 4, 5, 6, 7, 8],
      bands: [
        {
          min: 60,
          max: 100,
          label: '是 / 基本是',
          summary: '转化分≥60分。若其他8种体质转化分均＜30分为“是”，均＜40分为“基本是”。',
          recommendation: '平和质为理想体质，注意保持规律作息与均衡饮食。',
          tone: 'calm',
        },
        {
          min: 0,
          max: 59,
          label: '否',
          summary: '转化分＜60分，未达平和质判定标准。',
          recommendation: '可结合其他偏颇体质结果综合判断，并适度调理。',
          tone: 'attention',
        },
      ],
    },
    {
      key: 'qixu',
      name: '气虚质（B型）',
      items: [9, 10, 11, 12, 13, 14, 15, 16],
      bands: [
        { min: 0, max: 29, label: '否', summary: '转化分＜30分，未显现气虚质倾向。', recommendation: '保持当前生活方式即可。', tone: 'calm' },
        { min: 30, max: 39, label: '倾向是', summary: '转化分30～39分，有气虚质倾向。', recommendation: '建议适当增加运动、避免过度劳累。', tone: 'attention' },
        { min: 40, max: 100, label: '是', summary: '转化分≥40分，可判定为气虚质。', recommendation: '建议结合中医调理，必要时咨询专业医师。', tone: 'urgent' },
      ],
    },
    {
      key: 'yangxu',
      name: '阳虚质（C型）',
      items: [17, 18, 19, 20, 21, 22, 23],
      bands: [
        { min: 0, max: 29, label: '否', summary: '转化分＜30分，未显现阳虚质倾向。', recommendation: '保持当前生活方式即可。', tone: 'calm' },
        { min: 30, max: 39, label: '倾向是', summary: '转化分30～39分，有阳虚质倾向。', recommendation: '建议注意保暖、少食生冷。', tone: 'attention' },
        { min: 40, max: 100, label: '是', summary: '转化分≥40分，可判定为阳虚质。', recommendation: '建议结合中医调理，必要时咨询专业医师。', tone: 'urgent' },
      ],
    },
    {
      key: 'yinxu',
      name: '阴虚质（D型）',
      items: [24, 25, 26, 27, 28, 29, 30, 31],
      bands: [
        { min: 0, max: 29, label: '否', summary: '转化分＜30分，未显现阴虚质倾向。', recommendation: '保持当前生活方式即可。', tone: 'calm' },
        { min: 30, max: 39, label: '倾向是', summary: '转化分30～39分，有阴虚质倾向。', recommendation: '建议避免熬夜、少食辛辣燥热之物。', tone: 'attention' },
        { min: 40, max: 100, label: '是', summary: '转化分≥40分，可判定为阴虚质。', recommendation: '建议结合中医调理，必要时咨询专业医师。', tone: 'urgent' },
      ],
    },
    {
      key: 'tanshi',
      name: '痰湿质（E型）',
      items: [32, 33, 34, 35, 36, 37, 38, 39],
      bands: [
        { min: 0, max: 29, label: '否', summary: '转化分＜30分，未显现痰湿质倾向。', recommendation: '保持当前生活方式即可。', tone: 'calm' },
        { min: 30, max: 39, label: '倾向是', summary: '转化分30～39分，有痰湿质倾向。', recommendation: '建议清淡饮食、适当运动。', tone: 'attention' },
        { min: 40, max: 100, label: '是', summary: '转化分≥40分，可判定为痰湿质。', recommendation: '建议结合中医调理，必要时咨询专业医师。', tone: 'urgent' },
      ],
    },
    {
      key: 'shire',
      name: '湿热质（F型）',
      items: [40, 41, 42, 43, 44, 45, 46],
      bands: [
        { min: 0, max: 29, label: '否', summary: '转化分＜30分，未显现湿热质倾向。', recommendation: '保持当前生活方式即可。', tone: 'calm' },
        { min: 30, max: 39, label: '倾向是', summary: '转化分30～39分，有湿热质倾向。', recommendation: '建议清淡祛湿、规律作息。', tone: 'attention' },
        { min: 40, max: 100, label: '是', summary: '转化分≥40分，可判定为湿热质。', recommendation: '建议结合中医调理，必要时咨询专业医师。', tone: 'urgent' },
      ],
    },
    {
      key: 'xueyu',
      name: '血瘀质（G型）',
      items: [47, 48, 49, 50, 51, 52, 53],
      bands: [
        { min: 0, max: 29, label: '否', summary: '转化分＜30分，未显现血瘀质倾向。', recommendation: '保持当前生活方式即可。', tone: 'calm' },
        { min: 30, max: 39, label: '倾向是', summary: '转化分30～39分，有血瘀质倾向。', recommendation: '建议适度运动、保持气血通畅。', tone: 'attention' },
        { min: 40, max: 100, label: '是', summary: '转化分≥40分，可判定为血瘀质。', recommendation: '建议结合中医调理，必要时咨询专业医师。', tone: 'urgent' },
      ],
    },
    {
      key: 'qiyu',
      name: '气郁质（H型）',
      items: [54, 55, 56, 57, 58, 59, 60],
      bands: [
        { min: 0, max: 29, label: '否', summary: '转化分＜30分，未显现气郁质倾向。', recommendation: '保持当前生活方式即可。', tone: 'calm' },
        { min: 30, max: 39, label: '倾向是', summary: '转化分30～39分，有气郁质倾向。', recommendation: '建议疏解情绪、增加社交与运动。', tone: 'attention' },
        { min: 40, max: 100, label: '是', summary: '转化分≥40分，可判定为气郁质。', recommendation: '建议结合中医调理，必要时咨询专业医师。', tone: 'urgent' },
      ],
    },
    {
      key: 'tebing',
      name: '特禀质（I型）',
      items: [61, 62, 63, 64, 65, 66, 67],
      bands: [
        { min: 0, max: 29, label: '否', summary: '转化分＜30分，未显现特禀质倾向。', recommendation: '保持当前生活方式即可。', tone: 'calm' },
        { min: 30, max: 39, label: '倾向是', summary: '转化分30～39分，有特禀质倾向。', recommendation: '建议留意过敏原、做好防护。', tone: 'attention' },
        { min: 40, max: 100, label: '是', summary: '转化分≥40分，可判定为特禀质。', recommendation: '建议结合中医调理，必要时咨询专业医师。', tone: 'urgent' },
      ],
    },
  ],
  scoring: {
    kind: 'profile',
    profileNote:
      '本表为多维剖析型，9 种体质各自独立计分。各体质：原始分 = 该体质所含条目得分之和；' +
      '转化分 = [(原始分 - 条目数) / (条目数 × 4)] × 100。' +
      '偏颇体质（除平和质外8种）判定：转化分≥40为“是”，30～39为“倾向是”，＜30为“否”。' +
      '平和质判定需结合其他8种体质转化分：均＜30为“是”，均＜40为“基本是”，否则为“否”。' +
      '最终体质结果以转化分与组合规则共同确定。',
  },
}

export default scale
