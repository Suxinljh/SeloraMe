import { Button, Image, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import Nav from "../../components/Nav";
import Icon from "../../components/Icon";
import { assessments, type Assessment } from "../../data/assessments";
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

type Category = {
  name: string;
  assessmentCategory?: Assessment["category"];
  icon: string;
};

const categories: Category[] = [
  { name: "性格人格", icon: psychologyIcon },
  { name: "情绪心理", assessmentCategory: "emotion", icon: sentimentSatisfiedIcon },
  { name: "恋爱关系", icon: favoriteIcon },
  { name: "人际关系", icon: groupsIcon },
  { name: "职场能力", icon: businessCenterIcon },
  { name: "自我探索", icon: exploreIcon },
  { name: "生活状态", icon: spaIcon },
  { name: "兴趣偏好", icon: paletteIcon },
  { name: "趣味测试", icon: autoAwesomeIcon },
  { name: "专业量表", icon: badgeIcon },
];

const hotTags = [
  "MBTI深度版",
  "依恋理论",
  "焦虑自评量表",
  "九型人格",
  "抑郁倾向筛查",
  "社交恐惧指数",
  "情绪耗竭度",
  "职场高潜潜质",
];

export default function Categories() {
  const goToList = (name: string) => {
    const category = name === "情绪心理" ? "?category=emotion" : "";
    Taro.navigateTo({ url: `/pages/assessment-list/index${category}` });
  };

  useDidShow(() => setActiveTab(1));

  return (
    <View className="page categories-page">
      <Nav light className="categories-nav">
        <View className="categories-nav-heading">
          <Text className="categories-title">全部测评</Text>
          <Text className="categories-subtitle">
            按心理维度与生活情境分类探索
          </Text>
        </View>
      </Nav>
      <View className="categories-content">
        <View className="categories-grid">
          {categories.map(({ name, assessmentCategory, icon }) => {
            const count = assessments.filter(
              (assessment) => assessment.category === assessmentCategory,
            ).length;

            return (
            <View
              key={name}
              className="categories-card"
              onClick={() => goToList(name)}
            >
              <View className="categories-card-copy">
                <Text className="categories-card-name">{name}</Text>
                <Text className="categories-card-count">{count}</Text>
              </View>
              <View className="categories-card-icon-wrap">
                <Image src={icon} className="categories-card-icon" mode="aspectFit" />
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
              <Text
                key={tag}
                className="categories-tag"
                onClick={() =>
                  goToList(
                    tag.includes("焦虑") || tag.includes("抑郁")
                      ? "情绪心理"
                      : "",
                  )
                }
              >
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
            <Text className="categories-suggest-detail">
              告诉我们你的困惑，即刻为你匹配
            </Text>
          </View>
          <Button
            className="categories-suggest-button"
            onClick={() =>
              Taro.showToast({ title: "建议功能即将上线", icon: "none" })
            }
          >
            提建议
          </Button>
        </View>
      </View>
    </View>
  );
}
