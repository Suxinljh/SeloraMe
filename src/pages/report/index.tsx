import { useState } from "react";
import { Button, Text, View } from "@tarojs/components";
import Taro, { useDidShow, useLoad } from "@tarojs/taro";
import Nav from "../../components/Nav";
import Icon from "../../components/Icon";
import { getScale, maxOptionScore, polePercents, poleTally, questionOptions, rankTally, resolveBand, scoreAnswers, summarizeAnswer, topLetter, usesInteraction, LETTER_LABELS, DISC_LABELS, MBTI_PAIRS, type QuizAnswers, type Scale } from "../../data/scales";
import { mbtiTypeInfo } from "../../data/scales/personality/mbti-types";
import UnlockSheet from "../../components/UnlockSheet";
import { getSession, resetSession } from "../../store/session";
import { getPoints, isReportUnlocked, pointsCostOf, requiresUnlock, unlockReport } from "../../store/purchase";

const MBTI_LETTERS = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
const DISC_LETTERS = ['D', 'I', 'S', 'C']
const LETTER_ORDER = [...MBTI_LETTERS, ...DISC_LETTERS.filter((letter) => !MBTI_LETTERS.includes(letter))]

const letterLabelOf = (letter: string): string => LETTER_LABELS[letter] ?? DISC_LABELS[letter] ?? letter


const defaultDisclaimer =
  "本结果仅供自我筛查与健康教育参考，不构成医疗建议或诊断。若症状持续、加重，或影响工作、生活及人际关系，请咨询精神科、心理科或其他合格心理健康专业人员。";

export default function Report() {
  const [scaleId, setScaleId] = useState("");
  const [answers, setAnswers] = useState<QuizAnswers>([]);
  const [completedAt, setCompletedAt] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [balance, setBalance] = useState(0);
  const [sheetVisible, setSheetVisible] = useState(false);

  useLoad((options) => {
    const id = typeof options.assessment === "string" ? options.assessment : "phq-9";
    const target = getScale(id);
    setScaleId(id);
    if (!target) return;
    const session = getSession(target.id, target.questions.length);
    setAnswers(session.answers);
    setCompletedAt(session.completedAt);
  });

  const refreshPurchase = () => {
    setBalance(getPoints());
    setUnlocked(isReportUnlocked(scaleId));
  };
  useDidShow(refreshPurchase);

  const scale: Scale | undefined = getScale(scaleId);

  if (!scale) {
    return (
      <View className="report-page">
        <Nav back />
        <View className="report-content">
          <View className="report-card">
            <Text className="report-section-title">未找到该评测</Text>
          </View>
        </View>
      </View>
    );
  }

  const result = scoreAnswers(scale, answers);

  /**
   * 字母型评测（16 型、DISC）：类型由各极累计得分决定，不按选项分值计分。
   * 用 poleTally 而非 letterCounts —— 前者支持两端多刻度题（32 题快速版），
   * 选项按下标加权；A/B 二选一题型在其下退化为给所选那一极记 1 分。
   */
  const poleMode = scale.questions.some((question) => question.poles !== undefined || (question.letters?.length ?? 0) > 0);
  const tally = poleMode ? poleTally(scale, answers) : {};
  const usedLetters = Object.keys(tally).filter((letter) => (tally[letter] ?? 0) > 0);
  const isMbti = poleMode && usedLetters.length > 0 && usedLetters.every((letter) => MBTI_LETTERS.includes(letter));
  const isDisc = poleMode && usedLetters.length > 0 && usedLetters.every((letter) => DISC_LETTERS.includes(letter));
  const mbtiPercents = isMbti ? polePercents(tally, MBTI_PAIRS) : [];
  const typeCode = isMbti
    ? mbtiPercents.map((item) => item.winner).join('')
    : isDisc ? topLetter(tally, DISC_LETTERS) : '';
  const typeInfo = isMbti ? mbtiTypeInfo(typeCode) : undefined;
  const letterMode = poleMode;
  /** 深度内容是否上锁：标价评测未解锁时隐藏维度分布、解读与作答回顾 */
  const locked = requiresUnlock(scale) && !unlocked;

  const bandValue = scale.scoring.kind === "average" ? result.average : result.total;
  const band = resolveBand(scale.scoring.bands, bandValue);
  const tone = band?.tone ?? "calm";
  const finished = completedAt ? new Date(completedAt) : new Date();
  const time = `${finished.getFullYear()}-${String(finished.getMonth() + 1).padStart(2, "0")}-${String(finished.getDate()).padStart(2, "0")}`;

  /** PHQ-9 第 9 题非 0 时的安全提示 */
  const safetyQuestionIndex = scale.id === "phq-9" ? 8 : -1;
  const safetyAnswer = safetyQuestionIndex >= 0 ? answers[safetyQuestionIndex] : null;
  const needsSafetyNotice = typeof safetyAnswer === "number" && safetyAnswer > 0;

  const restart = () => {
    resetSession(scale.id, scale.questions.length);
    Taro.redirectTo({ url: `/pages/questions/index?assessment=${scale.id}` });
  };

  const scoreLabel = scale.scoring.kind === "average" ? "均分" : "总分";
  const maxScore = scale.questions
    .filter((question) => question.scored !== false)
    .reduce((sum, question) => sum + Math.max(0, ...questionOptions(scale, question).map((option) => option.score)), 0);

  return (
    <View className="report-page">
      <Nav back />
      <View className="report-content">
        <View className="report-meta">
          <View>
            <Text className="report-name">
              <Icon name="psychology" className="title-icon" />
              {scale.title}
            </Text>
            <Text>完成时间：{time} · 共 {scale.questions.length} 题</Text>
          </View>
          <Button onClick={restart}>
            <Icon name="replay" className="button-icon" />
            重新测评
          </Button>
        </View>

        {letterMode ? (
          <View className="phq-summary-card phq-calm">
            <Text className="phq-eyebrow">{isMbti ? "你的类型代码" : "你的主导类型"}</Text>
            <Text className="report-type">{typeCode}</Text>
            <Text className="phq-severity">{typeInfo ? `${typeInfo.name} · ${typeInfo.nick}` : letterLabelOf(typeCode[0] ?? "")}</Text>
            <Text className="phq-summary">{scale.scoring.profileNote ?? "本评测不计算总分，结果由各类型被选中的次数决定。"}</Text>
          </View>
        ) : scale.scoring.kind === "profile" ? (
          <View className="phq-summary-card phq-calm">
            <Text className="phq-eyebrow">多维剖析型评测</Text>
            <Text className="phq-severity">本评测不计算总分</Text>
            <Text className="phq-summary">{scale.scoring.profileNote ?? "结果以各维度得分的组合形态呈现，请参考下方维度明细。"}</Text>
          </View>
        ) : (
          <View className={`phq-summary-card phq-${tone}`}>
            <Text className="phq-eyebrow">{scoreLabel}</Text>
            <View className="phq-score-line">
              <Text className="phq-total">{Math.round(bandValue * 10) / 10}</Text>
              <Text className="phq-max">/ {maxScore} 分</Text>
            </View>
            <Text className="phq-severity">{band?.label ?? "已完成"}</Text>
            {band && <Text className="phq-range">{band.summary}</Text>}
            {band && <Text className="phq-summary">{band.recommendation}</Text>}
            {!band && <Text className="phq-summary">该评测源文档未给出明确的分界值，因此不展示分级。可在下方查看各维度得分。</Text>}
          </View>
        )}

        {needsSafetyNotice && (
          <View className="phq-safety-card">
            <Icon name="helpOutline" className="phq-safety-icon" />
            <View>
              <Text>请优先关注当下安全</Text>
              <Text>你在第 9 题选择了非「完全没有」。如果你有立即伤害自己或无法保证安全的风险，请立刻联系当地急救服务、前往最近急诊，或联系可信任的人陪伴。此结果不能替代专业风险评估。</Text>
            </View>
          </View>
        )}

        {!locked && letterMode && (
          <View className="report-card">
            <Text className="report-section-title">{isMbti ? "四维倾向分布" : "各类型选择次数"}</Text>
            <Text className="tiny muted">{isMbti ? "越接近 50% 说明该维度两端越均衡" : "被选中次数最多的类型即你的主导倾向"}</Text>
            {isMbti
              ? mbtiPercents.map((item) => (
                  <View className="score" key={item.first}>
                    <View>
                      <Text>{letterLabelOf(item.first)} / {letterLabelOf(item.second)}</Text>
                      <Text>{item.firstPercent}% : {item.secondPercent}%</Text>
                    </View>
                    <View className="bar">
                      <View style={{ width: `${item.firstPercent}%` }} />
                    </View>
                    <Text>{item.winner} 倾向更明显</Text>
                  </View>
                ))
              : DISC_LETTERS.filter((letter) => (tally[letter] ?? 0) > 0).map((letter) => {
                  const value = tally[letter] ?? 0;
                  const maxValue = Math.max(1, ...DISC_LETTERS.map((item) => tally[item] ?? 0));
                  return (
                    <View className="score" key={letter}>
                      <View>
                        <Text>{letterLabelOf(letter)}</Text>
                        <Text>{value} 次</Text>
                      </View>
                      <View className="bar">
                        <View style={{ width: `${Math.round((value / maxValue) * 100)}%` }} />
                      </View>
                    </View>
                  );
                })}
          </View>
        )}

        {!locked && !letterMode && scale.dimensions.length > 0 && (
          <View className="report-card">
            <Text className="report-section-title">维度明细</Text>
            <Text className="tiny muted">各维度得分越高，表示该维度描述的特征越明显</Text>
            {scale.dimensions.map((dimension) => {
              const score = result.byDimension[dimension.key] ?? 0;
              const dimensionMax = dimension.items.length * maxOptionScore(scale);
              const percent = dimensionMax > 0 ? Math.min(100, Math.round((score / dimensionMax) * 100)) : 0;
              const dimensionBand = resolveBand(dimension.bands, score);

              return (
                <View className="score" key={dimension.key}>
                  <View>
                    <Text>{dimension.name}</Text>
                    <Text>{Math.round(score * 10) / 10} 分</Text>
                  </View>
                  <View className="bar">
                    <View style={{ width: `${percent}%` }} />
                  </View>
                  {dimensionBand && <Text>{dimensionBand.label}：{dimensionBand.summary}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {!locked && usesInteraction(scale, 'rank') && (
          <View className="report-card">
            <Text className="report-section-title">各选项累计名次分</Text>
            <Text className="tiny muted">每题按名次换算成分值（选项数 → 1），逐题累加</Text>
            {rankTally(scale, answers).map((value, index) => {
              const tallest = Math.max(1, ...rankTally(scale, answers));
              const sample = questionOptions(scale, scale.questions[0])[index]?.label ?? `选项 ${index + 1}`;
              return (
                <View className="score" key={sample}>
                  <View>
                    <Text>{sample}</Text>
                    <Text>{value} 分</Text>
                  </View>
                  <View className="bar">
                    <View style={{ width: `${Math.round((value / tallest) * 100)}%` }} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {!locked && <View className="report-card">
          <Text className="report-section-title">作答回顾</Text>
          <Text className="tiny muted">按各题的作答交互还原你的选择</Text>
          {scale.questions.map((question, index) => {
            const answer = answers[index] ?? null;
            const letter = typeof answer === 'number' && answer >= 0 ? question.letters?.[answer] ?? null : null;

            return (
              <View className="score" key={question.id}>
                <View>
                  <Text>{question.id}. {question.text}</Text>
                  <Text>{letter ?? ''}</Text>
                </View>
                <Text>{summarizeAnswer(scale, question, answer)}</Text>
              </View>
            );
          })}
        </View>}

        {!locked && isMbti && typeInfo && (
          <View className="report-card">
            <Text className="report-section-title">类型解读</Text>
            <Text className="report-type-desc">{typeInfo.desc}</Text>
            <Text className="report-section-subtitle">典型特质</Text>
            {typeInfo.traits.map((item) => (
              <View className="report-bullet" key={item}><Text>{item}</Text></View>
            ))}
            <Text className="report-section-subtitle">可能适合的方向</Text>
            {typeInfo.careers.map((item) => (
              <View className="report-bullet" key={item}><Text>{item}</Text></View>
            ))}
          </View>
        )}

        {locked && (
          <View className="report-locked" onClick={() => setSheetVisible(true)}>
            <Icon name="psychology" className="report-locked-icon" />
            <Text className="report-locked-title">详细报告尚未解锁</Text>
            <Text className="report-locked-desc">
              解锁后可查看四维倾向分布、类型解读、典型特质、适合方向与全部作答回顾
            </Text>
            <View className="report-locked-action">
              <Text>{pointsCostOf(scale)} 积分解锁 · 永久查看</Text>
              <Icon name="chevronRight" className="report-locked-chevron" />
            </View>
          </View>
        )}

        <View className="phq-disclaimer">
          <Text>重要提示</Text>
          <Text>{scale.disclaimer ?? defaultDisclaimer}</Text>
          {scale.source && <Text>评测来源：{scale.source}</Text>}
        </View>
      </View>

      <View className="quiz-footer report-footer">
        <Button className="quiz-prev" onClick={restart}>
          <Icon name="replay" className="button-icon" />
          重新测评
        </Button>
        <Button
          className="quiz-next share"
          onClick={() => Taro.showToast({ title: "报告已保存在本次测评记录中", icon: "none" })}
        >
          <Icon name="share" className="button-icon" />
          保存结果
        </Button>
      </View>

      <UnlockSheet
        visible={sheetVisible}
        scale={scale}
        balance={balance}
        onClose={() => setSheetVisible(false)}
        onConfirm={() => {
          const result = unlockReport(scale);
          setSheetVisible(false);
          if (result === 'unlocked' || result === 'already' || result === 'free') {
            refreshPurchase();
            Taro.showToast({ title: '已解锁，可永久查看', icon: 'none' });
          } else {
            Taro.showToast({ title: '积分不足', icon: 'none' });
          }
        }}
        onRecharge={() => {
          setSheetVisible(false);
          Taro.showToast({ title: '充值功能待接入', icon: 'none' });
        }}
      />
    </View>
  );
}
