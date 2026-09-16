import { Text, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import { useState } from "react";
import Icon from "../../components/Icon";
import Nav from "../../components/Nav";
import { getPurchaseOrder, type PurchaseOrder } from "../../store/orders";

const formatDate = (time: number) => {
  const date = new Date(time);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatPrice = (price: number) => `¥${price.toFixed(2)}`;

export default function OrderDetail() {
  const [order, setOrder] = useState<PurchaseOrder | undefined>();
  useLoad((options) => {
    if (typeof options.order === "string")
      setOrder(getPurchaseOrder(options.order));
  });

  return (
    <View className="order-detail-page">
      <Nav back light />
      <View className="order-detail-content">
        <Text className="order-detail-title">交易详情</Text>
        {order ? (
          <>
            <View className="order-detail-status">
              <View className="order-detail-status-icon">
                <Icon name="check" />
              </View>
              <View>
                <Text>交易成功</Text>
                <Text>{formatDate(order.createdAt)}</Text>
              </View>
            </View>
            <View className="order-detail-card">
              <Text className="order-detail-assessment">
                {order.assessmentTitle}
              </Text>
              <View className="order-detail-line">
                <Text>数量</Text>
                <Text>× {order.quantity}</Text>
              </View>
              <View className="order-detail-line">
                <Text>单价</Text>
                <Text>{formatPrice(order.unitPrice)}</Text>
              </View>
            </View>
            <View className="order-detail-card">
              <View className="order-detail-line">
                <Text>订单编号</Text>
                <Text selectable>{order.id}</Text>
              </View>
              <View className="order-detail-line">
                <Text>交易时间</Text>
                <Text>{formatDate(order.createdAt)}</Text>
              </View>
              <View className="order-detail-line">
                <Text>优惠</Text>
                <Text>
                  {order.discount > 0
                    ? `- ${formatPrice(order.discount)}`
                    : "无优惠"}
                </Text>
              </View>
              <View className="order-detail-total">
                <Text>实付金额</Text>
                <Text>{formatPrice(order.totalPrice)}</Text>
              </View>
            </View>
          </>
        ) : (
          <View className="orders-empty">
            <Icon
              name="receipt"
              variant="outlined"
              className="orders-empty-icon"
            />
            <Text>订单不存在</Text>
            <Text>该订单可能已被删除或无法读取。</Text>
          </View>
        )}
      </View>
    </View>
  );
}
