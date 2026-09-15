import type { ReactNode } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Icon from "./Icon";
export default function Nav({
  back = false,
  light = false,
  children,
  className = "",
}: {
  back?: boolean;
  light?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <>
      <View className="top-space" />
      <View className={`nav ${light ? "light" : ""} ${className}`}>
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
