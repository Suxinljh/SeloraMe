import { Button, Image, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import Nav from "../../components/Nav";
import Icon from "../../components/Icon";
import { SCALE_CATEGORIES, categoryCounts, type ScaleCategory } from "../../data/scales";
import { setActiveTab } from "../../utils/custom-tabbar";
import psychologyIcon from "../../assets/icons/material/category-psychology.svg";
import sentimentSatisfiedIcon from "../../assets/icons/material/category-sentiment-satisfied.svg";
import favoriteIcon from "../../assets/icons/material/category-favorite.svg";
import groupsIcon from "../../assets/icons/material/category-groups.svg";
import businessCenterIcon from "../../assets/icons/material/category-business-center.svg";
import exploreIcon from "../../assets/icons/material/category-explore.svg";
import spaIcon from "../../assets/icons/material/category-spa.svg";
import paletteIcon from "../../assets/icons/material/category-palette.svg";
import autoAwesomeIcon from "../../assets/icons/material/category-auto-awesome.svg";
import badgeIcon from "../../assets/icons/material/category-badge.svg";

/** 分类图标。key 与 SCALE_CATEGORIES 一一对应 */
const categoryIcons: Record<ScaleCategory, string> = {
  personality: psychologyIcon,
  emotion: sentimentSatisfiedIcon,
  romance: favoriteIcon,
  social: groupsIcon,
  career: businessCenterIcon,
  self: exploreIcon,
  lifestyle: spaIcon,
  interest: paletteIcon,
  fun: autoAwesomeIcon,
  professional: badgeIcon,
};

const hotTags = [
  "16 型人格",
  "霍兰德职业兴趣",
  "抑郁",
  "艾森克人格",
  "焦虑",
  "依恋",
  "中医体质",
  "情商",
];

export default function Categories() {
  const counts = categoryCounts();

  const goToList = (key: ScaleCategory, count: number) => {
    if (count === 0) {
      Taro.showToast({ title: "该分类评测正在筹备中", icon: "none" });
      return;
    }
    Taro.navigateTo({ url: `/pages/assessment-list/index?category=${key}` });
  };

  /** 热门标签指向所属分类；找不到对应分类时回落到情绪心理 */
  const goByTag = (tag: string) => {
    const matched = SCALE_CATEGORIES.find(({ name }) => tag.includes(name.slice(0, 2)));
    const key: ScaleCategory = matched ? matched.key : "emotion";
    goToList(key, counts[key]);
  };

  useDidShow(() => setActiveTab(1));

  return (
    <View className="page categories-page">
      <Nav light className="categories-nav">
        <View className="categories-nav-heading">
          <Text className="categories-title">全部测评</Text>
          <Text className="categories-subtitle">按心理维度与生活情境分类探索</Text>
        </View>
      </Nav>
      <View className="categories-content">
        <View className="categories-grid">
          {SCALE_CATEGORIES.map(({ key, name }) => {
            const count = counts[key];
            const empty = count === 0;

            return (
              <View
                key={key}
                className={`categories-card ${empty ? "is-empty" : ""}`}
                onClick={() => goToList(key, count)}
              >
                <View className="categories-card-copy">
                  <Text className="categories-card-name">{name}</Text>
                  <Text className="categories-card-count">
                    {empty ? "筹备中" : `${count} 个评测`}
                  </Text>
                </View>
                <View className="categories-card-icon-wrap">
                  <Image
                    src={categoryIcons[key]}
                    className="categories-card-icon"
                    mode="aspectFit"
                  />
                </View>
              </View>
            );
          })}
        </View>
        <View className="categories-hot">
          <View className="categories-section-head categories-hot-head">
            <Text>热门标签快捷索引</Text>
            <Icon name="autoAwesome" className="categories-hot-icon" />
          </View>
          <View className="categories-tags">
            {hotTags.map((tag) => (
              <Text key={tag} className="categories-tag" onClick={() => goByTag(tag)}>
                # {tag}
              </Text>
            ))}
          </View>
        </View>
        <View className="categories-suggest">
          <View className="categories-suggest-icon-wrap">
            <Icon name="helpOutline" className="categories-suggest-icon" />
          </View>
          <View className="categories-suggest-copy">
            <Text className="categories-suggest-title">找不到心仪测评？</Text>
            <Text className="categories-suggest-detail">告诉我们你的困惑，即刻为你匹配</Text>
          </View>
          <Button
            className="categories-suggest-button"
            onClick={() => Taro.showToast({ title: "建议功能即将上线", icon: "none" })}
          >
            提建议
          </Button>
        </View>
      </View>
    </View>
  );
}
