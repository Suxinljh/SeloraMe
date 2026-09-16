import { useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Icon from "./Icon";
import { getNavMetrics } from "../utils/layout";

/**
 * 自绘导航栏。
 *
 * 状态栏占位与导航栏高度都在运行时按设备实测值给出（见 utils/layout），
 * 样式表里的 .top-space / .nav 数值只作为兜底，因此这里用内联样式覆盖。
 * 高度用的是 min-height 而不是 height：页面若在样式里写了更高的导航栏
 * （分类页 / 我的），仍能撑开，不会被这里压回去。
 */
export default function Nav({
  back = false,
  light = false,
  children,
  className = "",
  style,
}: {
  back?: boolean;
  light?: boolean;
  children?: ReactNode;
  className?: string;
  /** 透传到导航栏容器，用于按页面覆盖布局值 */
  style?: CSSProperties;
}) {
  const metrics = useMemo(getNavMetrics, []);

  return (
    <>
      <View className="top-space" style={{ height: `${metrics.topSpace}rpx` }} />
      <View
        className={`nav ${light ? "light" : ""} ${className}`}
        style={{
          minHeight: `${metrics.navHeight}rpx`,
          paddingRight: `${metrics.capsuleReserve}rpx`,
          ...style,
        }}
      >
        {back ? (
          <Icon
            name="arrowBack"
            className="back"
            onClick={() => Taro.navigateBack()}
          />
        ) : (
          <View />
        )}
        {children}
      </View>
    </>
  );
}
