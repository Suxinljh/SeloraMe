import { useState } from 'react'
import { Button, Text, View } from '@tarojs/components'
import { interactionOf, questionOptions } from '../../../data/scales'
import type { InteractionProps } from '../types'

/**
 * 配对。题目的 options 是左列，interaction.targets 是右列。
 * 作答值是「左列下标 → 右列下标」的映射。
 *
 * 交互方式：先点左列一项，再点右列一项即可配对；
 * 点已配对的左项可解除，右项被重复占用时会自动把原配对解除。
 * 同样使用点击而非拖拽连线，保证小程序端稳定。
 */
export default function Matching ({ scale, question, answer, onChange }: InteractionProps) {
  const [pending, setPending] = useState<number | null>(null)
  const options = questionOptions(scale, question)
  const interaction = interactionOf(question)
  const targets = interaction.kind === 'match' ? interaction.targets : []
  const pairs: Record<string, number> = answer && typeof answer === 'object' && !Array.isArray(answer) ? answer : {}

  /** 按左列顺序编号，用于在两列上显示同一个配对序号 */
  const pairNumberOf = (leftIndex: number): number => {
    let count = 0
    for (let i = 0; i <= leftIndex; i += 1) {
      if (pairs[String(i)] !== undefined) count += 1
    }
    return pairs[String(leftIndex)] !== undefined ? count : 0
  }

  const targetOwner = (targetIndex: number): number =>
    Object.keys(pairs).find((key) => pairs[key] === targetIndex) !== undefined
      ? Number(Object.keys(pairs).find((key) => pairs[key] === targetIndex))
      : -1

  const tapLeft = (leftIndex: number) => {
    if (pairs[String(leftIndex)] !== undefined) {
      const next = { ...pairs }
      delete next[String(leftIndex)]
      onChange(Object.keys(next).length > 0 ? next : null)
      setPending(null)
      return
    }
    setPending(pending === leftIndex ? null : leftIndex)
  }

  const tapTarget = (targetIndex: number) => {
    if (pending === null) return
    const next: Record<string, number> = {}
    // 解除右列原有的占用，避免一对一关系被破坏
    Object.keys(pairs).forEach((key) => {
      if (pairs[key] !== targetIndex && Number(key) !== pending) next[key] = pairs[key]
    })
    next[String(pending)] = targetIndex
    onChange(next)
    setPending(null)
  }

  return (
    <View className='quiz-match'>
      <View className='quiz-options-hint'>
        <Text>
          {pending === null
            ? `先选左栏一项，再选右栏对应项（已完成 ${Object.keys(pairs).length} / ${options.length}）`
            : `已选中「${options[pending]?.label ?? ''}」，请点右栏对应项`}
        </Text>
      </View>
      <View className='quiz-match-columns'>
        <View className='quiz-match-col'>
          {options.map((option, index) => {
            const paired = pairs[String(index)] !== undefined
            return (
              <Button
                key={option.label}
                className={`quiz-match-item ${paired ? 'is-paired' : ''} ${pending === index ? 'is-pending' : ''}`}
                onClick={() => tapLeft(index)}
              >
                <Text className='quiz-match-text'>{option.label}</Text>
                {paired && <Text className='quiz-match-badge'>{pairNumberOf(index)}</Text>}
              </Button>
            )
          })}
        </View>
        <View className='quiz-match-col'>
          {targets.map((target, index) => {
            const owner = targetOwner(index)
            return (
              <Button
                key={target}
                className={`quiz-match-item ${owner >= 0 ? 'is-paired' : ''}`}
                onClick={() => tapTarget(index)}
              >
                <Text className='quiz-match-text'>{target}</Text>
                {owner >= 0 && <Text className='quiz-match-badge'>{pairNumberOf(owner)}</Text>}
              </Button>
            )
          })}
        </View>
      </View>
    </View>
  )
}
