import { Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import Icon from '../../components/Icon'
import Nav from '../../components/Nav'
import { getPurchaseOrders, type PurchaseOrder } from '../../store/orders'

const formatDate = (time: number) => {
  const date = new Date(time)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const formatPrice = (price: number) => `¥${price.toFixed(2)}`

export default function Orders () {
  const [orders, setOrders] = useState<PurchaseOrder[]>(getPurchaseOrders())
  useDidShow(() => setOrders(getPurchaseOrders()))

  return <View className='orders-page'><Nav back light /><View className='orders-content'>
    <Text className='orders-title'>我的订单</Text><Text className='orders-subtitle'>已完成支付的测评订单会显示在这里。</Text>
    {orders.length > 0 ? <View className='orders-list'>{orders.map((order) => <View className='order-card' key={order.id} onClick={() => Taro.navigateTo({ url: `/pages/order-detail/index?order=${order.id}` })}>
      <View className='order-card-head'><Text>交易成功</Text><Text>{formatDate(order.createdAt)}</Text></View>
      <Text className='order-card-title'>{order.assessmentTitle}</Text>
      <View className='order-card-footer'><Text>共 {order.quantity} 件</Text><View><Text>实付 </Text><Text className='order-card-price'>{formatPrice(order.totalPrice)}</Text><Icon name='chevronRight' className='order-card-chevron' /></View></View>
    </View>)}</View> : <View className='orders-empty'><Icon name='receipt' variant='outlined' className='orders-empty-icon' /><Text>暂无订单</Text><Text>购买测评后，可在这里查看交易记录。</Text></View>}
  </View></View>
}
