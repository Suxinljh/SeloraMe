# SelorMe Mini Program Reference

开发微信小程序相关功能时，优先查阅以下官方资料。

## Taro

Taro 官方文档：

https://docs.taro.zone/

开发前必须先通过 `package.json` 确认当前 Taro 版本，再选择对应版本文档。

重点章节：

### React / Taro 基础

https://docs.taro.zone/docs/react-overall

### Hooks / 页面生命周期

https://docs.taro.zone/docs/hooks/

### API

https://docs.taro.zone/docs/apis/about/desc

### 路由

https://docs.taro.zone/docs/apis/route/navigateTo

### 全局配置

https://docs.taro.zone/docs/app-config

### 编译配置

https://docs.taro.zone/docs/config-detail/

### 设计稿与尺寸单位

https://docs.taro.zone/docs/size

### Taro Components

https://docs.taro.zone/docs/components-desc

------

# 微信小程序官方文档

微信小程序官方开发文档：

https://developers.weixin.qq.com/miniprogram/dev/framework/

## 小程序框架

https://developers.weixin.qq.com/miniprogram/dev/framework/

## API

https://developers.weixin.qq.com/miniprogram/dev/api/

## 组件

https://developers.weixin.qq.com/miniprogram/dev/component/

## 全局配置

https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html

## 页面配置

https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html

## 页面生命周期

https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page-life-cycle.html

## 页面路由

https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html

## 网络

https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html

## 本地缓存

https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html

## 登录

https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html

## 微信支付

涉及支付时必须重新查询当前官方文档，不依赖历史实现或旧教程。

------

# Reference Rule

当：

- Taro 文档
- 微信小程序文档
- 普通 React Web 开发经验

之间发生冲突时：

对于 `weapp`：

优先确保符合微信小程序运行机制。

在 Taro 项目中优先寻找 Taro 官方提供的对应封装。

不要根据 Web API 推断小程序行为。