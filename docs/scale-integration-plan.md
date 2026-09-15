# 量表大全接入实施计划

> 状态：待确认
> 素材：`src/assets/量表大全/`（53 个文件，13MB）
> 目标：接入小程序量表体系，并归入现有 10 个分类

---

## 一、素材盘点结论

### 1.1 提取情况

53 个文件全部为二进制 Office 格式，已用 `textutil` + Python（openpyxl / xlrd / python-pptx / pypdf）完成文本提取。

| 格式 | 数量 | 提取结果 |
| --- | --- | --- |
| .doc | 34（含 1 个 Word 锁文件、已排除） | 33 成功 |
| .docx | 9 | 9 成功 |
| .xlsx | 5 | 5 成功 |
| .xls | 1 | **失败：Workbook is encrypted**（盖洛普优势测试.xls） |
| .pptx | 1 | 1 成功 |
| .ppt | 3 | **未提取：旧版二进制 PPT，本机无 LibreOffice，且均为课件非量表** |
| .pdf | 1 | 1 成功 |

提取产物共 49 份纯文本（约 820KB），存放于 `.workbuddy/tmp/extract/`（该目录已在 .gitignore 中，不入库）。

### 1.2 三个必须先说清的问题

**问题一：53 个文件 ≠ 53 个量表。** 存在明显重复与大量非量表文件：

- **MBTI 重复 5 份**：`MBTI性格测试.doc`、`MBTI职业性格测试(最佳完整版)全.doc`、`mbti/MBTI职业性格测试题(全面-含答案解释).doc`、`mbti/MBTI职业性格测试题(整理版).doc`、`mbti/《MBTI职业性格测试题》(有答案).doc`
- **霍兰德相关 7 份**，其中仅 2 份是量表本体，其余是报告样本与职业对照表
- **同量表跨格式重复 2 组**：`情商量表.doc` / `情商量表.xlsx`；`yale-brown强迫题目.docx` / `yale-brown强迫量表-修改.xlsx`
- **非量表文件约 10 份**：报告样本、职业对照表、理论解析手册、PPT 课件

去重后实际独立量表约 **32–35 个**。

**问题二：约 10 个文件不具备"可作答 + 可计分"的接入条件。**

| 文件 | 原因 |
| --- | --- |
| 0岁-6岁儿童发育行为评估量表.pdf | 他评量表，由医师施测，非自评 |
| (完整版)汉密尔顿焦虑量表(HAMA).doc | 他评量表，临床医生评定的 14 项 |
| 汉密尔顿抑郁量表.docx | 他评量表，临床医生评定 |
| 瑞文智力测验-60题.doc | 60 题全部为图形矩阵，**必须配图**，纯文本无法作答 |
| 瑞文智商标准推理测验(定时).ppt | 同上，且为计时测验 |
| 盖洛普优势测试.xls | 文件已加密，无法读取 |
| 心理测评量表介绍全解.ppt | 课件 |
| 兴趣与职业.ppt | 课件 |
| mbti/霍兰德职业兴趣测试报告.doc | 报告样本 |
| mbti/霍兰德职业兴趣测试结果分析报告.doc | 报告样本 |
| mbti/霍兰德代码及其相近职业.doc | 职业对照表 |
| mbti/霍兰德六种人格对应的典型职业.doc | 职业对照表 |
| mbti/职业生涯规划作业和霍兰德职业分析.doc | 作业文档 |
| mbti/高考选科的学科评估对学生选科情况进行评估和分析.docx | 分析报告 |
| 《盖洛普优势识别器2.0》34项优势解析.xlsx | 34 项优势解析手册，非量表 |

**问题三：计分规则完整度不一。** 45 份含计分/评分关键词，但质量差异极大：

- **规则完整**：SCL-90、EPQ、MSSMHS、MHRSP、中医体质、Yale-Brown、恋爱伴侣量表（xlsx 内直接给出"题目 | 计分 | 评分标准 | 分维度结果解释"四列结构，质量最高）
- **规则部分**：情商、逆商、挫折能力、考试焦虑——通常只给总分区间，无维度拆分
- **规则缺失**：DISC、MBTI 多版本、霍兰德测试题本体——需按官方通用规则补全
- **规则冲突**：MBTI 5 个版本的题目数与表述不一致，需择一为准

---

## 二、现有代码约束

当前实现**只支持 2 个量表**，接入前必须先扩展数据模型：

| 位置 | 现状 | 需要的改动 |
| --- | --- | --- |
| `src/data/assessments.ts` | `category: 'emotion' \| 'other'` 两个值；仅 6 条记录 | 扩展为 10 个分类枚举；补齐全部量表记录 |
| `src/pages/questions/index.tsx` | 硬编码 `phq-9` / `gad` 两套题库与选项 | 改为按 `assessmentId` 从数据层取题 |
| `src/pages/report/index.tsx` | 硬编码 PHQ-9/GAD-7 的计分与维度名 | 改为通用计分引擎 + 按量表取维度 |
| `src/pages/categories/index.tsx` | 10 个分类中仅「情绪心理」有 `assessmentCategory` 映射，其余计数恒为 0 | 建立 10 分类与量表的映射 |
| `src/pages/assessment-detail/index.tsx` | `detailContent` 仅 phq-9 / gad 有内容，其余走 fallback | 批量生成各量表介绍内容 |

---

## 三、10 分类映射方案（待确认）

| 分类 | 拟归入的量表 |
| --- | --- |
| 1. 性格人格 | MBTI 职业性格测试、DISC 性格测试、艾森克人格问卷 EPQ、艾森克儿童个性测试、青少年气质量表 |
| 2. 情绪心理 | 情商量表 EQ、内耗量表、考试焦虑测试、大学生心理健康自测表、心理健康自测表、挫折能力测试、中国中学生心理健康量表 |
| 3. 恋爱关系 | 爱情类型量表、适合我的恋爱伴侣量表 |
| 4. 人际关系 | *暂无合适素材*（现有量表无社交/人际维度） |
| 5. 职场能力 | 霍兰德职业兴趣量表、职业能力倾向测试、国际标准逆商测试题、中学生学习动机量表 MSMT |
| 6. 自我探索 | 中医体质量表、科尔伯格学习风格测试、儿少心理健康量表 |
| 7. 生活状态 | 青少年时间管理倾向量表、初中生学习习惯自测、王极盛心理健康量表 |
| 8. 兴趣偏好 | 学科兴趣测评标准、高考专业选择测试 |
| 9. 趣味测试 | *暂无合适素材*（瑞文智力测验因需配图被排除） |
| 10. 专业量表 | SCL-90、Yale-Brown 强迫量表、中学生心理健康量表 MSSMHS、小学生心理健康评定量表 MHRSP |

需注意：4「人际关系」与 9「趣味测试」在本批素材中没有可落地的量表，这两个分类会保持空态。

---

## 四、技术方案

### 4.1 数据模型改造

```ts
// src/data/scales/types.ts
export type ScaleCategory =
  | 'personality' | 'emotion' | 'romance' | 'social'
  | 'career' | 'self' | 'lifestyle' | 'interest'
  | 'fun' | 'professional'

export type ScaleOption = { label: string; score: number }

export type ScaleQuestion = {
  id: number
  text: string
  options: ScaleOption[]      // 支持每量表的选项集不同
  dimension?: string          // 归属维度，用于分维度报告
  reverse?: boolean           // 反向计分
}

export type ScaleDimension = {
  key: string
  name: string
  items: number[]             // 题号
  explain: string             // 该维度的结果解释
}

export type Scale = {
  id: string
  title: string
  desc: string
  category: ScaleCategory
  meta: string                // "9 题 · 约 3 分钟"
  tag: string
  free: boolean
  questions: ScaleQuestion[]
  dimensions: ScaleDimension[]
  scoring: {
    kind: 'sum' | 'mbti' | 'holland' | 'profile'
    bands?: { min: number; max: number; label: string; summary: string; recommendation: string }[]
  }
  disclaimer?: string
}
```

### 4.2 目录结构

```
src/data/scales/
├── types.ts              # 类型定义
├── index.ts              # 汇总导出 + 按分类分组
├── emotion/              # 按 10 分类分目录，每量表一个文件
├── personality/
├── career/
└── ...
```

### 4.3 生成方式

不手写 2000+ 道题。建立一次性生成脚本：

```
提取文本 → 解析为 JSON（题目/选项/维度/计分）→ 人工核对 → 生成 TS 模块
```

解析器按三类分别处理：
- **表格型**（xlsx / Word 表格）：直接按列映射，质量最高
- **行式型**（`1. 题干 \n A. xx \n B. xx`）：正则切分
- **段落型**（题目与选项挤在一行）：需按标点切分

### 4.4 UI 接线

1. `categories/index.tsx`：10 分类改为真实计数，空分类显示"即将开放"
2. `assessment-list/index.tsx`：按 `?category=` 过滤
3. `assessment-detail/index.tsx`：从数据层取介绍，移除 fallback
4. `questions/index.tsx`：改造为通用答题页，支持每量表不同选项集
5. `report/index.tsx`：改造为通用报告页，按 `scoring.kind` 分发

---

## 五、分阶段计划

| 阶段 | 内容 | 交付物 |
| --- | --- | --- |
| **P0** | 数据模型改造 + 把现有 PHQ-9/GAD-7 迁移到新模型 | 类型定义、迁移后的 2 个量表、通用答题页与报告页跑通 |
| **P1** | 解析器 + 表格型量表批量接入（质量最高的一批） | 恋爱伴侣量表、Yale-Brown、内涵量表等 |
| **P2** | 行式型标准量表接入 | SCL-90、EPQ、MSSMHS、中医体质等 |
| **P3** | 需补全计分规则的量表 | MBTI、DISC、霍兰德 |
| **P4** | 分类聚合 + 详情页文案 + 分类空态处理 | 10 分类完整可用 |

P0 是关键路径：数据模型与通用页面不确定，后续批量接入都是白做。

---

## 六、需要确认的问题

1. **范围**：是否排除上表列出的约 15 个不可接入文件（他评量表、需配图、加密、课件、报告样本）？还是要求全部接入？
2. **计分策略**：规则缺失/冲突的量表（MBTI 多版本、DISC、霍兰德）如何处理——按官方通用规则补全，还是只做"作答记录 + 维度分布"不出总分？
3. **重复版本**：MBTI 5 份、霍兰德 7 份是否合并为各 1 个量表？
4. **推进方式**：是否按 P0 → P4 顺序分阶段交付，每阶段完成后由你验收再继续？
