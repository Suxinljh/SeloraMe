import { useState } from "react";
import { Button, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import Nav from "../../components/Nav";
import Icon from "../../components/Icon";
import {
  gadQuestions,
  getGadSeverity,
  getPhqSeverity,
  phqImpactOptions,
  phqQuestions,
} from "../../data/assessments";
import {
  getGadSession,
  getPhqSession,
  resetGadSession,
  resetPhqSession,
} from "../../store/session";

const phqNames = [
  "兴趣减退",
  "情绪低落",
  "睡眠困扰",
  "疲倦乏力",
  "食欲改变",
  "自我评价低",
  "注意力困难",
  "动作或坐立不安",
  "自伤相关想法",
];
const gadNames = [
  "紧张或不安",
  "无法控制担忧",
  "过度担心",
  "难以放松",
  "坐立不安",
  "易怒或急躁",
  "害怕不好的事发生",
];

export default function Report() {
  const [assessment, setAssessment] = useState<"phq-9" | "gad">("phq-9");
  const [phqSession, setPhqSession] = useState(getPhqSession);
  const [gadSession, setGadSession] = useState(getGadSession);
  useLoad((options) => {
    if (options.assessment === "gad") {
      setAssessment("gad");
      setGadSession(getGadSession());
    } else {
      setPhqSession(getPhqSession());
    }
  });
  const gad = assessment === "gad";
  const session = gad ? gadSession : phqSession;
  const answers = session.answers.map((answer) => answer ?? 0);
  const score = answers.reduce((sum, answer) => sum + answer, 0);
  const severity = gad ? getGadSeverity(score) : getPhqSeverity(score);
  const completed = session.completedAt
    ? new Date(session.completedAt)
    : new Date();
  const time = `${completed.getFullYear()}-${String(completed.getMonth() + 1).padStart(2, "0")}-${String(completed.getDate()).padStart(2, "0")}`;
  const names = gad ? gadNames : phqNames;
  const questions = gad ? gadQuestions : phqQuestions;
  const assessmentName = gad ? "GAD-7 广泛性焦虑筛查" : "PHQ-9 抑郁情绪筛查";
  const restart = () => {
    if (gad) resetGadSession();
    else resetPhqSession();
    Taro.redirectTo({ url: `/pages/questions/index?assessment=${assessment}` });
  };
  return (
    <View className="report-page phq-report-page">
      <Nav back />
      <View className="report-content phq-report-content">
        <View className="report-meta">
          <View>
            <Text className="report-name">
              <Icon name="psychology" className="title-icon" />
              {assessmentName}
            </Text>
            <Text>完成时间：{time} · 过去两周</Text>
          </View>
          <Button onClick={restart}>
            <Icon name="replay" className="button-icon" />
            重新测评
          </Button>
        </View>
        <View className={`phq-summary-card phq-${severity.tone}`}>
          <Text className="phq-eyebrow">{gad ? "GAD-7" : "PHQ-9"} 总分</Text>
          <View className="phq-score-line">
            <Text className="phq-total">{score}</Text>
            <Text className="phq-max">/ {gad ? 21 : 27} 分</Text>
          </View>
          <Text className="phq-severity">{severity.label}</Text>
          <Text className="phq-range">{severity.range}</Text>
          <Text className="phq-summary">{severity.summary}</Text>
        </View>
        {!gad && answers[8] > 0 && (
          <View className="phq-safety-card">
            <Icon name="helpOutline" className="phq-safety-icon" />
            <View>
              <Text>请优先关注当下安全</Text>
              <Text>
                你在第 9
                题选择了非“完全没有”。如果你有立即伤害自己或无法保证安全的风险，请立刻联系当地急救服务、前往最近急诊，或联系可信任的人陪伴。此结果不能替代专业风险评估。
              </Text>
            </View>
          </View>
        )}
        <View className="report-card">
          <Text className="report-section-title">结果解读</Text>
          <View className="meaning purple-box">
            <Text>
              <Icon name="psychology" className="meaning-icon" />
              筛查结果
            </Text>
            <Text>
              {severity.summary} {gad ? "GAD-7" : "PHQ-9"}{" "}
              是症状筛查工具，不等同于临床诊断；诊断仍需由合格专业人员结合完整访谈作出。
            </Text>
          </View>
          {!gad && (
            <View className="meaning orange-box">
              <Text>
                <Icon name="sentimentSatisfied" className="meaning-icon" />
                功能影响
              </Text>
              <Text>
                {phqSession.impact === null
                  ? "尚未记录功能影响。"
                  : `你选择了“${phqImpactOptions[phqSession.impact]}”。功能困难不计入 PHQ-9 总分，但可帮助专业人员理解症状对生活的影响。`}
              </Text>
            </View>
          )}
          <View className="meaning green-box">
            <Text>
              <Icon name="spa" className="meaning-icon" />
              下一步建议
            </Text>
            <Text>{severity.recommendation}</Text>
          </View>
        </View>
        <View className="report-card">
          <Text className="report-section-title">症状维度明细</Text>
          <Text className="tiny muted">
            每项 0–3 分，分数越高表示该症状出现更频繁
          </Text>
          {names.map((name, index) => (
            <View className="score" key={name}>
              <View>
                <Text>
                  {index + 1}. {name}
                </Text>
                <Text>{answers[index]} / 3 分</Text>
              </View>
              <View className="bar">
                <View style={{ width: `${(answers[index] / 3) * 100}%` }} />
              </View>
              <Text>{questions[index].text}</Text>
            </View>
          ))}
        </View>
        <View className="phq-disclaimer">
          <Text>重要提示</Text>
          <Text>
            本结果仅供自我筛查与健康教育参考，不构成医疗建议或诊断。若症状持续、加重，或影响工作、生活及人际关系，请咨询精神科、心理科或其他合格心理健康专业人员。
          </Text>
        </View>
      </View>
      <View className="quiz-footer report-footer">
        <Button className="quiz-prev" onClick={restart}>
          <Icon name="replay" className="button-icon" />
          重新测评
        </Button>
        <Button
          className="quiz-next share"
          onClick={() =>
            Taro.showToast({
              title: "报告已保存在本次测评记录中",
              icon: "none",
            })
          }
        >
          <Icon name="share" className="button-icon" />
          保存结果
        </Button>
      </View>
    </View>
  );
}
