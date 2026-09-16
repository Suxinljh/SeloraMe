import Taro from '@tarojs/taro'

/**
 * 自绘导航栏的布局度量。
 *
 * 页面用了 `navigationStyle: 'custom'`，导航栏要自己画，但状态栏高度和原生胶囊
 * 的位置都是「逻辑像素（pt）」，且随机型变化很大（状态栏 20pt ~ 59pt）。
 * 而样式表里的 rpx 是跟着屏幕**宽度**缩放的，两者不是一回事：
 * 同一个 rpx 在不同机型上换算出不同的 pt，所以写死数值只能在一种机型上正确。
 *
 * 这里的值全部按运行时实测换算，样式表里的数值只是取不到数据时的兜底。
 * 单位一律是 rpx —— 本工程源码 px 与 rpx 是 1:1（designWidth 390 + pxtransform），
 * 而 1rpx = windowWidth / 750 pt，所以 pt 换 rpx 要乘 750 / windowWidth。
 */
export type NavMetrics = {
  /** 状态栏高度，用于 .top-space 占位 */
  topSpace: number
  /** 导航栏高度，等于原生导航栏高度（胶囊上下留白对称），与胶囊垂直居中对齐 */
  navHeight: number
  /** 右侧需要为胶囊预留的宽度 */
  capsuleReserve: number
}

/** 胶囊与右侧内容之间额外留出的呼吸间距，单位 pt */
const CAPSULE_GAP = 8

/** 取不到设备信息时的兜底值（约等于 390pt 宽屏 + 44pt 状态栏的标准导航栏） */
const FALLBACK: NavMetrics = {
  topSpace: 86,
  navHeight: 85,
  capsuleReserve: 196,
}

const ptToRpx = (pt: number, windowWidth: number) => Math.round((pt * 750) / windowWidth)

export function getNavMetrics (): NavMetrics {
  try {
    const { windowWidth, statusBarHeight } = Taro.getWindowInfo()
    const capsule = Taro.getMenuButtonBoundingClientRect()
    if (!windowWidth || !statusBarHeight || !capsule || !capsule.height) return FALLBACK

    // 胶囊在原生导航栏内上下留白对称，所以导航栏高度 = 上留白 × 2 + 胶囊高度，
    // 这样导航栏内垂直居中的内容就和胶囊在同一水平线上。
    const gap = capsule.top - statusBarHeight
    const navHeightPt = gap > 0 ? gap * 2 + capsule.height : 44

    return {
      topSpace: ptToRpx(statusBarHeight, windowWidth),
      navHeight: ptToRpx(navHeightPt, windowWidth),
      capsuleReserve: ptToRpx(windowWidth - capsule.left + CAPSULE_GAP, windowWidth),
    }
  } catch {
    return FALLBACK
  }
}
