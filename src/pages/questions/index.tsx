import { useState } from "react";
import { Button, Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import Icon from "../../components/Icon";
import Nav from "../../components/Nav";
import { getScale, questionOptions, type Scale } from "../../data/scales";
import { completeSession, getSession, saveAnswer } from "../../store/session";

export default function Questions() {
  const [scaleId, setScaleId] = useState("phq-9");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);

  useLoad((options) => {
    const id = typeof options.assessment === "string" ? options.assessment : "phq-9";
    setScaleId(id);
    const target = getScale(id);
    if (target) {
      setAnswers(getSession(target.id, target.questions.length).answers);
    }
  });

  const scale: Scale | undefined = getScale(scaleId);

  if (!scale) {
    return (
      <View className="question-page">
        <Nav back />
        <View className="quiz-body">
          <View className="quiz-question-card">
            <Text className="question-title">未找到该量表</Text>
          </View>
        </View>
      </View>
    );
  }

  const total = scale.questions.length;
  const current = scale.questions[step];
  const selected = answers[step] ?? null;
  const options = questionOptions(scale, current);
  const progress = Math.round(((step + 1) / total) * 100);
  const isLast = step + 1 === total;

  const choose = (optionIndex: number) => {
    saveAnswer(scale.id, total, step, optionIndex);
    setAnswers(getSession(scale.id, total).answers);
  };

  const next = () => {
    if (selected === null) {
      Taro.showToast({ title: "请选择一项后继续", icon: "none" });
      return;
    }
    if (isLast) {
      completeSession(scale.id, total);
      Taro.redirectTo({ url: `/pages/report/index?assessment=${scale.id}` });
      return;
    }
    setStep((currentStep) => currentStep + 1);
  };

  const previous = () => (step === 0 ? Taro.navigateBack() : setStep((currentStep) => currentStep - 1));

  return (
    <View className="question-page">
      <Nav back />
      <View className="quiz-body">
        <View className="quiz-progress">
          <View className="quiz-progress-summary">
            <View className="question-chip">
              <View className="question-chip-dot" />
              <Text>第 {step + 1} / {total} 题</Text>
            </View>
            <View className="progress-copy">
              <Text>{progress}%</Text>
              <Text>已完成</Text>
            </View>
          </View>
          <View className="progress-track">
            <View className="progress-value" style={{ width: `${progress}%` }} />
          </View>
        </View>

        <View className="quiz-question-card">
          <View className="question-orb" />
          <Text className="question-kind">{scale.title}</Text>
          <Text className="question-title">{current.text}</Text>
        </View>

        <View className="quiz-options">
          {options.map((option, index) => (
            <Button
              key={option.label}
              className={`quiz-option ${selected === index ? "is-selected" : ""}`}
              onClick={() => choose(index)}
            >
              <View className="option-main">
                <View className="option-radio">
                  <View className="option-radio-dot" />
                </View>
                <View className="option-copy">
                  <Text className="option-title">{option.label}</Text>
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
          <Text>请按实际情况作答；结果用于自我了解与初步筛查，不构成临床诊断。</Text>
        </View>
      </View>

      <View className="quiz-footer">
        <Button className="quiz-prev" onClick={previous}>
          <Icon name="arrowBack" className="button-icon" />
          <Text>{step === 0 ? "返回" : "上一题"}</Text>
        </Button>
        <Button className="quiz-next" onClick={next}>
          <Text>{isLast ? "查看报告" : "下一题"}</Text>
          <Icon name="arrowForward" className="button-icon" />
        </Button>
      </View>
    </View>
  );
}
