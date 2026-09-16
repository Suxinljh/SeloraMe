import { Button, Text, View } from "@tarojs/components";
import Taro, { useDidShow, useLoad } from "@tarojs/taro";
import { useState } from "react";
import Icon from "../../components/Icon";
import Nav from "../../components/Nav";
import { SCALE_CATEGORIES, getScale } from "../../data/scales";
import {
  isFavoriteAssessment,
  toggleFavoriteAssessment,
} from "../../store/favorites";
import { requireLogin } from "../../utils/auth-guard";

const categoryNames = SCALE_CATEGORIES.reduce<Record<string, string>>(
  (acc, { key, name }) => {
    acc[key] = name;
    return acc;
  },
  {},
);

export default function AssessmentDetail() {
  const [scaleId, setScaleId] = useState("phq-9");
  const [isFavorite, setIsFavorite] = useState(false);

  useLoad((options) => {
    if (typeof options.assessment === "string") setScaleId(options.assessment);
  });

  const scale = getScale(scaleId);
  useDidShow(() =>
    setIsFavorite(scale ? isFavoriteAssessment(scale.id) : false),
  );

  if (!scale) {
    return (
      <View className="assessment-detail-page">
        <Nav back light />
        <View className="assessment-detail-content">
          <View className="assessment-detail-empty">
            <Text>未找到该评测</Text>
            <Text>它可能已被移除，请返回列表重新选择。</Text>
          </View>
        </View>
      </View>
    );
  }

  const start = () => {
    if (!requireLogin("开始测评并保存答题记录")) return;
    Taro.navigateTo({ url: `/pages/questions/index?assessment=${scale.id}` });
  };

  const toggleFavorite = () => {
    if (!requireLogin("收藏量表")) return;
    const nextValue = toggleFavoriteAssessment(scale.id);
    setIsFavorite(nextValue);
    Taro.showToast({
      title: nextValue ? "已收藏测评" : "已取消收藏",
      icon: "none",
    });
  };

  return (
    <View className="assessment-detail-page">
      <Nav back light />
      <View className="assessment-detail-content">
        <View className="assessment-detail-hero">
          <View className="assessment-detail-orb" />
          <Button
            className={`assessment-detail-favorite ${isFavorite ? "is-favorite" : ""}`}
            onClick={toggleFavorite}
          >
            <Icon
              name="bookmark"
              variant={isFavorite ? "round" : "outlined"}
              className="assessment-detail-favorite-icon"
            />
            {isFavorite ? "已收藏" : "收藏测评"}
          </Button>
          <Text className="assessment-detail-label">{scale.tag}</Text>
          <Text className="assessment-detail-title">{scale.title}</Text>
          <Text className="assessment-detail-description">{scale.desc}</Text>
          <View className="assessment-detail-metrics">
            <View>
              <Text className="assessment-detail-metric-value">
                {scale.duration}
              </Text>
              <Text>预计用时</Text>
            </View>
            <View>
              <Text className="assessment-detail-metric-value">
                {scale.questions.length} 题
              </Text>
              <Text>题目数量</Text>
            </View>
            <View>
              <Text className="assessment-detail-metric-value">
                {categoryNames[scale.category]}
              </Text>
              <Text>所属分类</Text>
            </View>
          </View>
        </View>

        <View className="assessment-detail-section">
          <View className="assessment-detail-section-title">
            <Icon
              name="psychology"
              className="assessment-detail-section-icon"
            />
            <Text>这是个什么样的测试？</Text>
          </View>
          {scale.intro.map((paragraph) => (
            <Text key={paragraph} className="assessment-detail-paragraph">
              {paragraph}
            </Text>
          ))}
          {scale.highlights.length > 0 && (
            <Text className="assessment-detail-highlights">
              {scale.highlights}
            </Text>
          )}
        </View>

        {scale.benefits.length > 0 && (
          <View className="assessment-detail-section assessment-detail-source">
            <View className="assessment-detail-section-title">
              <Icon
                name="assessment"
                className="assessment-detail-section-icon"
              />
              <Text>这个测试有什么用？</Text>
            </View>
            {scale.benefits.map((benefit) => (
              <View key={benefit.title} className="assessment-detail-benefit">
                <Text>{benefit.title}</Text>
                <Text>{benefit.description}</Text>
              </View>
            ))}
          </View>
        )}

        {scale.instructions.length > 0 && (
          <View className="assessment-detail-section">
            <View className="assessment-detail-section-title">
              <Icon name="quiz" className="assessment-detail-section-icon" />
              <Text>测试说明</Text>
            </View>
            {scale.instructions.map((instruction, index) => (
              <View key={instruction} className="assessment-detail-instruction">
                <Text>{index + 1}</Text>
                <Text>{instruction}</Text>
              </View>
            ))}
          </View>
        )}

        {scale.source && (
          <View className="assessment-detail-source-note">
            <Icon name="badge" className="assessment-detail-source-icon" />
            <View>
              <Text>评测来源</Text>
              <Text>{scale.source}</Text>
            </View>
          </View>
        )}

        <View className="assessment-detail-report-note">
          <Icon name="assessment" className="assessment-detail-report-icon" />
          <View>
            <Text>完成后生成分析报告</Text>
            <Text>包含总分、结果说明与下一步建议</Text>
          </View>
        </View>
      </View>
      <View className="assessment-detail-footer">
        <Button className="assessment-detail-start" onClick={start}>
          立即开始
        </Button>
      </View>
    </View>
  );
}
