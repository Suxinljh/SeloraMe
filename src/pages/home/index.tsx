import { View, Text, Button, ScrollView, Image } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import Nav from "../../components/Nav";
import Icon from "../../components/Icon";
import searchIcon from "../../assets/figma/home-search.svg";
import { getScale, isFreeScale, priceLabelOf, SCALE_CATEGORIES, type Scale } from "../../data/scales";
import { coverFor } from "../../data/covers";
import { setActiveTab } from "../../utils/custom-tabbar";

const categoryNames = SCALE_CATEGORIES.reduce<Record<string, string>>((acc, { key, name }) => {
  acc[key] = name;
  return acc;
}, {});

/** 首页主推量表。其余推荐位在下方 featuredIds 中列出 */
const heroScaleId = "internal-friction";

/** 推荐测评栏目展示的量表，按展示顺序排列 */
const featuredIds = [
  "mbti",
  "attachment",
  "major-choice",
  "phq-9",
  "gad",
  "college-mental",
  "study-habit",
  "learning-style",
];

/** 分类快捷入口 */
const categoryEntries: Array<[string, string]> = [
  ["情绪心理", "emotion"],
  ["性格人格", "personality"],
  ["专业量表", "professional"],
  ["恋爱关系", "romance"],
  ["职场能力", "career"],
  ["生活状态", "lifestyle"],
];

/** 推荐位标签。按顺序循环取用，与 styles/index.scss 中的 badge-N 对应 */
const badges = ["专业", "热门", "深度", "轻松"];

export default function Home() {
  const goDetail = (scaleId: string) =>
    Taro.navigateTo({ url: `/pages/assessment-detail/index?assessment=${scaleId}` });
  const goCategory = (category: string) =>
    Taro.navigateTo({ url: `/pages/assessment-list/index?category=${category}` });

  useDidShow(() => setActiveTab(0));

  const hero: Scale | undefined = getScale(heroScaleId);
  const heroCover = hero ? coverFor(hero.id) : undefined;
  const featured = featuredIds.flatMap((id) => {
    const scale = getScale(id);
    return scale ? [scale] : [];
  });

  return (
    <View className="page home-page">
      <Nav light />
      <View className="content">
        <View className="search home-search" onClick={() => Taro.navigateTo({ url: "/pages/search/index" })}>
          <Image src={searchIcon} className="search-icon" />
          <Text>搜索测评，如 MBTI、霍兰德、焦虑指数...</Text>
        </View>

        {hero && (
          <View className="hero">
            <View className="hero-decor decor-purple" />
            <View className="hero-decor decor-green" />
            {heroCover && <Image className="hero-cover" src={heroCover} mode="aspectFill" />}
            <View className="hero-top">
              <Text>
                <Icon name="autoAwesome" className="label-icon" />
                今日特别推荐
              </Text>
              <Text>{hero.duration}</Text>
            </View>
            <View className="hero-copy">
              <Text className="hero-title">{hero.title}</Text>
              <Text className="hero-desc">{hero.desc}</Text>
            </View>
            <View className="hero-footer">
              <Button className="start" onClick={() => goDetail(hero.id)}>
                开始探索　
                <Icon name="arrowForward" className="button-icon" />
              </Button>
              <View className="complete">
                <Text>{hero.questions.length} 题</Text>
                <Text>{categoryNames[hero.category]}</Text>
              </View>
            </View>
          </View>
        )}

        <ScrollView scrollX className="home-tabs-scroll">
          <View className="home-tabs">
            {categoryEntries.map(([label, category], i) => (
              <Text
                key={category}
                className={`home-chip ${i === 0 ? "selected" : ""}`}
                onClick={() => goCategory(category)}
              >
                {i === 0 ? "●　" : ""}
                {label}
              </Text>
            ))}
          </View>
        </ScrollView>

        <View className="section-head">
          <Text className="section-title">推荐测评</Text>
          <Text className="purple tiny" onClick={() => Taro.navigateTo({ url: "/pages/assessment-list/index" })}>
            查看全部
          </Text>
        </View>

        <View className="assessment-grid">
          {featured.map((scale, i) => {
            const cover = coverFor(scale.id);
            return (
              <View key={scale.id} className="feature-card" onClick={() => goDetail(scale.id)}>
                <View className="art">
                  {cover ? (
                    <Image src={cover} mode="aspectFill" />
                  ) : (
                    <View className="art-fallback">
                      <Icon name="psychology" className="art-fallback-icon" />
                    </View>
                  )}
                  <Text className={`art-badge badge-${i % badges.length}`}>{badges[i % badges.length]}</Text>
                </View>
                <Text className="feature-title">{scale.title}</Text>
                <Text className="feature-desc">{scale.desc}</Text>
                <View className="feature-meta">
                  <Text>
                    <Icon name="schedule" className="meta-icon" />
                    {scale.duration}
                  </Text>
                  <Text className={isFreeScale(scale) ? 'green' : 'price'}>{priceLabelOf(scale)}</Text>
                </View>
              </View>
            );
          })}
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
