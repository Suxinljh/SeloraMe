import { Button, Form, Image, Input, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useState } from "react";
import Nav from "../../components/Nav";
import Icon, { type IconName } from "../../components/Icon";
import {
  getCurrentUser,
  loginWithWechatProfile,
  type SelormeUser,
} from "../../store/auth";
import {
  getReportAssessments,
  getUnfinishedAssessments,
} from "../../data/archive";
import { getProfileOverview } from "../../data/profile-overview";
import { setActiveTab } from "../../utils/custom-tabbar";
import { getFavoriteAssessmentIds } from "../../store/favorites";

type ArchiveRow = [
  IconName,
  string,
  string,
  string,
  "unfinished" | "purchased" | "reports",
];
const services: Array<[IconName, string, string]> = [
  ["receipt", "我的订单", "查看交易"],
  ["bookmark", "收藏的测评", ""],
  ["psychology", "关注主题", ""],
  ["calendar", "情绪打卡日历", "今日已打卡"],
  ["helpOutline", "帮助与反馈", ""],
  ["settings", "设置与隐私", ""],
];

export default function Profile() {
  const [user, setUser] = useState<SelormeUser | null>(getCurrentUser());
  const [nickname, setNickname] = useState("");
  const [avatarPath, setAvatarPath] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [unfinishedCount, setUnfinishedCount] = useState(
    getUnfinishedAssessments().length,
  );
  const [reportCount, setReportCount] = useState(getReportAssessments().length);
  const [overview, setOverview] = useState(getProfileOverview());
  const [favoriteCount, setFavoriteCount] = useState(
    getFavoriteAssessmentIds().length,
  );
  const hasNickname = nickname.trim().length > 0;
  useDidShow(() => {
    setUser(getCurrentUser());
    setUnfinishedCount(getUnfinishedAssessments().length);
    setReportCount(getReportAssessments().length);
    setOverview(getProfileOverview());
    setFavoriteCount(getFavoriteAssessmentIds().length);
    setActiveTab(2);
  });

  const chooseAvatar = (event: { detail: { avatarUrl?: string } }) =>
    setAvatarPath(event.detail.avatarUrl || "");
  const submitProfile = async (event: {
    detail: { value?: Record<string, unknown> };
  }) => {
    const submittedNickname = event.detail.value?.nickname;
    const nextNickname = (
      typeof submittedNickname === "string" ? submittedNickname : nickname
    ).trim();
    if (!nextNickname) {
      Taro.showToast({ title: "请填写昵称", icon: "none" });
      return;
    }
    setLoggingIn(true);
    try {
      setUser(await loginWithWechatProfile(nextNickname, avatarPath));
      Taro.showToast({ title: "登录成功", icon: "success" });
    } catch (error) {
      console.warn("SeloraMe profile login failed", error);
      Taro.showToast({ title: "登录失败，请重试", icon: "none" });
    } finally {
      setLoggingIn(false);
    }
  };
  const rows: ArchiveRow[] = [
    [
      "quiz",
      "继续测评",
      unfinishedCount ? `未完成 · ${unfinishedCount}` : "",
      unfinishedCount ? "已开始的测评可随时继续作答" : "暂无未完成测评",
      "unfinished",
    ],
    ["inventory", "已购买测评", "", "查看已解锁的付费测评", "purchased"],
    [
      "assessment",
      "测评报告汇总",
      reportCount ? `${reportCount} 份报告` : "",
      reportCount ? "已完成测评的报告可随时回看" : "暂无已生成报告",
      "reports",
    ],
  ];

  return (
    <View className="page">
      <Nav light className="profile-nav">
        {
          <View
            className="profile-nav-user"
            onClick={() =>
              !user && Taro.showToast({ title: "请先登录", icon: "none" })
            }
          >
            {user?.avatarUrl ? (
              <Image
                className="profile-nav-avatar avatar-image"
                src={user.avatarUrl}
                mode="aspectFill"
              />
            ) : (
              <View className="profile-nav-avatar">
                <Icon
                  name="accountCircle"
                  className="profile-nav-avatar-icon"
                />
              </View>
            )}
            <View className="profile-nav-copy">
              <Text className="profile-nav-nickname">
                {user?.nickName ?? "请登录"}
              </Text>
              {user && (
                <Text className="profile-nav-progress">
                  {overview.completedCount
                    ? `已完成 ${overview.completedCount} 项心理测评`
                    : "开始你的第一项心理测评"}
                </Text>
              )}
            </View>
          </View>
        }
      </Nav>
      <View className="content">
        <View className="stats">
          {[
            [String(overview.completedCount), "已完成测评"],
            [String(overview.reportCount), "专属报告"],
            [String(overview.topics.length), "关注主题"],
          ].map(([value, label]) => (
            <View
              key={label}
              onClick={() =>
                Taro.navigateTo({
                  url:
                    label === "已完成测评" || label === "专属报告"
                      ? "/pages/archive/index?type=reports"
                      : "/pages/topics/index",
                })
              }
            >
              <Text>{value}</Text>
              <Text>{label}</Text>
            </View>
          ))}
        </View>
        <Text className="group-title">心理档案空间</Text>
        <View className="archive card">
          {rows.map(([icon, title, badge, desc, type]) => (
            <View
              className="archive-row"
              key={title}
              onClick={() =>
                Taro.navigateTo({ url: `/pages/archive/index?type=${type}` })
              }
            >
              <View className="archive-icon">
                <Icon name={icon} className="row-icon" />
              </View>
              <View>
                <Text className="row-title">
                  {title}　{badge}
                </Text>
                <Text className="row-desc">{desc}</Text>
              </View>
              <Icon name="chevronRight" className="row-chevron" />
            </View>
          ))}
        </View>
        <Text className="group-title">日常服务</Text>
        <View className="services card">
          {services.map(([icon, title, extra]) => (
            <View
              className="service"
              key={title}
              onClick={() => {
                if (title === "我的订单")
                  Taro.navigateTo({ url: "/pages/orders/index" });
                if (title === "收藏的测评")
                  Taro.navigateTo({
                    url: "/pages/archive/index?type=favorites",
                  });
                if (title === "关注主题")
                  Taro.navigateTo({ url: "/pages/topics/index" });
                if (title === "设置与隐私")
                  Taro.navigateTo({ url: "/pages/settings/index" });
              }}
            >
              <View className="service-icon">
                <Icon
                  name={icon}
                  variant="outlined"
                  className="service-icon-glyph"
                />
              </View>
              <Text className="row-title">{title}</Text>
              <Text className="service-extra">
                {title === "收藏的测评"
                  ? favoriteCount
                    ? `${favoriteCount} 项`
                    : ""
                  : title === "关注主题"
                    ? overview.topics.length
                      ? `${overview.topics.length} 项`
                      : ""
                    : extra}
              </Text>
              <Icon name="chevronRight" className="row-chevron" />
            </View>
          ))}
        </View>
        <Text className="version">SeloraMe v2.4.0 · 守护你的心理自愈角落</Text>
      </View>
    </View>
  );
}
