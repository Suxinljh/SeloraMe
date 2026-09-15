import { Button, Text, View } from '@tarojs/components'
import Icon from './Icon'
import { pointsCostOf } from '../store/purchase'
import type { Scale } from '../data/scales'

/**
 * 解锁详细报告的半屏弹层。
 *
 * 只负责展示与回调，不直接读写存储 —— 解锁与充值由调用方处理，
 * 便于在支付接入后替换成真实的下单流程。
 */
export default function UnlockSheet ({
  visible,
  scale,
  balance,
  onClose,
  onConfirm,
  onRecharge,
}: {
  visible: boolean
  scale: Scale
  balance: number
  onClose: () => void
  onConfirm: () => void
  onRecharge: () => void
}) {
  if (!visible) return null

  const cost = pointsCostOf(scale)
  const enough = balance >= cost

  return (
    <View className='unlock-mask' onClick={onClose}>
      <View className='unlock-sheet' catchMove onClick={(event) => event.stopPropagation()}>
        <View className='unlock-handle' />
        <Text className='unlock-title'>解锁《{scale.title}》详细报告</Text>

        <View className='unlock-rate'>
          <Icon name='badge' className='unlock-rate-icon' />
          <Text>1 积分 = 1 元，积分可用于解锁任意测评的详细报告</Text>
        </View>

        <View className='unlock-rows'>
          <View className='unlock-row'>
            <Text>本报告所需积分</Text>
            <Text className='unlock-cost'>{cost} 积分</Text>
          </View>
          <View className='unlock-row'>
            <Text>当前积分余额</Text>
            <Text className={enough ? 'unlock-balance' : 'unlock-balance is-low'}>{balance} 积分</Text>
          </View>
        </View>

        <View className='unlock-perks'>
          <View className='unlock-perk'>
            <Icon name='check' className='unlock-perk-icon' />
            <Text>购买后可永久查看，重新进入无需再次付费</Text>
          </View>
          <View className='unlock-perk'>
            <Icon name='check' className='unlock-perk-icon' />
            <Text>包含四维倾向分布、类型解读、特质与适合方向</Text>
          </View>
          <View className='unlock-perk'>
            <Icon name='check' className='unlock-perk-icon' />
            <Text>包含全部作答回顾，可对照每一题的选择</Text>
          </View>
        </View>

        <Button
          className={`unlock-confirm ${enough ? '' : 'is-disabled'}`}
          onClick={enough ? onConfirm : onRecharge}
        >
          {enough ? `立即解锁（${cost} 积分）` : '积分不足，去充值'}
        </Button>
        <Button className='unlock-cancel' onClick={onClose}>暂不解锁</Button>
      </View>
    </View>
  )
}
