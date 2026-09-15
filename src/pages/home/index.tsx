import { View, Text, Button, ScrollView, Image } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import Nav from "../../components/Nav";
import Icon from "../../components/Icon";
import searchIcon from "../../assets/figma/home-search.svg";
import heroImage from "../../assets/figma/home-hero.svg";
import mbtiImage from "../../assets/figma/home-mbti.png";
import moodImage from "../../assets/figma/home-mood.png";
import relationshipImage from "../../assets/figma/home-relationship.png";
import workImage from "../../assets/figma/home-work.png";
import { setActiveTab } from "../../utils/custom-tabbar";

const cards = [
  [
    "专业",
    "MBTI 人格全解析",
    "深度了解你的性格偏好与处事模式",
    "18分钟",
    "免费",
    mbtiImage,
  ],
  [
    "热门",
    "近期情绪晴雨表",
    "看看你最近处于哪种心理能量水平",
    "8分钟",
    "免费",
    moodImage,
  ],
  [
    "深度",
    "亲密关系依恋模式",
    "探索你在亲密互动中的安全感与期待",
    "12分钟",
    "免费",
    relationshipImage,
  ],
  [
    "轻松",
    "职场心理能量评估",
    "诊断精力枯竭与个人职业倦怠诱因",
    "10分钟",
    "免费",
    workImage,
  ],
];

export default function Home() {
  const go = () => Taro.navigateTo({ url: "/pages/questions/index" });
  useDidShow(() => setActiveTab(0));
  return (
    <View className="page home-page">
      <Nav light />
      <View className="content">
        <View className="search home-search">
          <Image src={searchIcon} className="search-icon" />
          <Text>搜索测评，如 MBTI、依恋模式、焦虑指数...</Text>
        </View>
        <View className="hero">
          <View className="hero-decor decor-purple" />
          <View className="hero-decor decor-green" />
          <Image className="hero-illustration" src={heroImage} />
          <View className="hero-top">
            <Text>
              <Icon name="autoAwesome" className="label-icon" />
              今日特别推荐
            </Text>
            <Text>约15分钟</Text>
          </View>
          <View className="hero-copy">
            <Text className="hero-title">
              探索内心的\n<Text>温和回响</Text>
            </Text>
            <Text className="hero-desc">
              15分钟，带你厘清近期潜意识与真实情绪图谱，找回内在节奏。
            </Text>
          </View>
          <View className="hero-footer">
            <Button className="start" onClick={go}>
              开始探索　
              <Icon name="arrowForward" className="button-icon" />
            </Button>
            <View className="complete">
              <Text>9k+</Text>
              <Text>人已完成</Text>
            </View>
          </View>
        </View>
        <ScrollView scrollX className="home-tabs-scroll">
          <View className="home-tabs">
            {["情绪", "性格", "关系", "职场", "爱情", "自我探索"].map(
              (x, i) => (
                <Text
                  key={x}
                  className={`home-chip ${i === 0 ? "selected" : ""}`}
                >
                  {i === 0 ? "●　" : ""}
                  {x}
                </Text>
              ),
            )}
          </View>
        </ScrollView>
        <View className="section-head">
          <Text className="section-title">推荐测评</Text>
          <Text
            className="purple tiny"
            onClick={() =>
              Taro.navigateTo({ url: "/pages/assessment-list/index" })
            }
          >
            查看全部
          </Text>
        </View>
        <View className="assessment-grid">
          {cards.map(([badge, title, desc, duration, price, image], i) => (
            <View key={title} className="feature-card" onClick={go}>
              <View className="art">
                <Image src={image as string} mode="aspectFill" />
                <Text className={`art-badge badge-${i}`}>{badge}</Text>
              </View>
              <Text className="feature-title">{title}</Text>
              <Text className="feature-desc">{desc}</Text>
              <View className="feature-meta">
                <Text>
                  <Icon name="schedule" className="meta-icon" />
                  {duration}
                </Text>
                <Text className={price === "免费" ? "green" : "price"}>
                  {price}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View className="quote">
          <Text className="quote-mark">“</Text>
          <View>
            <Text>“接纳全部的自己，是改变与自愈的开始。”</Text>
            <Text>每日心理心签 · 卡尔·罗杰斯</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
