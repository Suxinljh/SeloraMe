import { useState } from "react";
import { Button, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import Icon from "../../components/Icon";
import Nav from "../../components/Nav";
import {
  gadOptions,
  gadQuestions,
  phqImpactOptions,
  phqOptions,
  phqQuestions,
} from "../../data/assessments";
import {
  completeGadSession,
  completePhqSession,
  getGadSession,
  getPhqSession,
  saveGadAnswer,
  savePhqAnswer,
  savePhqImpact,
} from "../../store/session";

type AssessmentId = "phq-9" | "gad";
const isGad = (id: AssessmentId) => id === "gad";

export default function Questions() {
  const [assessment, setAssessment] = useState<AssessmentId>("phq-9");
  const [step, setStep] = useState(0);
  const [phqSession, setPhqSession] = useState(getPhqSession);
  const [gadSession, setGadSession] = useState(getGadSession);
  useLoad((options) => {
    if (options.assessment === "gad") setAssessment("gad");
  });
  const gad = isGad(assessment);
  const questions = gad ? gadQuestions : phqQuestions;
  const options = gad ? gadOptions : phqOptions;
  const isImpactStep = !gad && step === questions.length;
  const selected = gad
    ? gadSession.answers[step]
    : isImpactStep
      ? phqSession.impact
      : phqSession.answers[step];
  const totalSteps = questions.length + (gad ? 0 : 1);
  const progress = Math.round(((step + 1) / totalSteps) * 100);
  const labels = isImpactStep
    ? phqImpactOptions
    : options.map((option) => option.label);
  const title = isImpactStep
    ? "以上这些问题对您的工作、处理家中事务或与人相处时造成多大困难？"
    : questions[step].text;

  const choose = (index: number) => {
    if (gad) {
      saveGadAnswer(step, index);
      setGadSession(getGadSession());
      return;
    }
    if (isImpactStep) savePhqImpact(index);
    else savePhqAnswer(step, index);
    setPhqSession(getPhqSession());
  };
  const next = () => {
    if (selected === null) {
      Taro.showToast({ title: "请选择一项后继续", icon: "none" });
      return;
    }
    if (step + 1 === totalSteps) {
      if (gad) completeGadSession();
      else completePhqSession();
      Taro.redirectTo({ url: `/pages/report/index?assessment=${assessment}` });
      return;
    }
    setStep((current) => current + 1);
  };
  const previous = () =>
    step === 0 ? Taro.navigateBack() : setStep((current) => current - 1);
  return (
    <View className="question-page phq-question-page">
      <Nav back />
      <View className="quiz-body">
        <View className="quiz-progress">
          <View className="quiz-progress-summary">
            <View className="question-chip">
              <View className="question-chip-dot" />
              <Text>
                第 {step + 1} / {totalSteps} 题
              </Text>
            </View>
            <View className="progress-copy">
              <Text>{progress}%</Text>
              <Text>已完成</Text>
            </View>
          </View>
          <View className="progress-track">
            <View
              className="progress-value"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
        <View className="quiz-question-card">
          <View className="question-orb" />
          <Text className="question-kind">
            {gad ? "GAD-7" : "PHQ-9"} · 过去两周
          </Text>
          <Text className="question-title">{title}</Text>
        </View>
        <View className="quiz-options">
          {labels.map((label, index) => (
            <Button
              key={label}
              className={`quiz-option ${selected === index ? "is-selected" : ""}`}
              onClick={() => choose(index)}
            >
              <View className="option-main">
                <View className="option-radio">
                  <View className="option-radio-dot" />
                </View>
                <View className="option-copy">
                  <Text className="option-title">{label}</Text>
                  {!isImpactStep && (
                    <Text className="option-hint">
                      {options[index].score} 分
                    </Text>
                  )}
                </View>
              </View>
              {selected === index ? (
                <View className="selected-check">
                  <Icon name="check" className="selected-check-icon" />
                </View>
              ) : (
                <Icon name="chevronRight" className="option-chevron" />
              )}
            </Button>
          ))}
        </View>
        <View className="quiz-note">
          <Icon name="autoAwesome" className="note-icon" />
          <Text>请按过去两周的实际感受作答；本量表用于筛查，不用于诊断。</Text>
        </View>
      </View>
      <View className="quiz-footer">
        <Button className="quiz-prev" onClick={previous}>
          <Icon name="arrowBack" className="button-icon" />
          <Text>{step === 0 ? "返回" : "上一题"}</Text>
        </Button>
        <Button className="quiz-next" onClick={next}>
          <Text>{step + 1 === totalSteps ? "查看报告" : "下一题"}</Text>
          <Icon name="arrowForward" className="button-icon" />
        </Button>
      </View>
    </View>
  );
}
