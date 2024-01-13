import { nextTick, ref } from 'vue'
import useSelect from '../src/useSelect/index'

it('base', () => {
  const { activeValue, activeItem } = useSelect({
    items: [
      { value: 1, label: '一' },
      { value: 2, label: '二' },
      { value: 3, label: '三' },
      { value: 4, label: '四' },
      { value: 5, label: '五' },
    ]
  })
  expect(activeValue.value).toBeUndefined()
  expect(activeItem.value).toBeUndefined()
})

it('empty items', () => {
  const { activeValue, activeItem } = useSelect({
    items: [],
    autoSelect: true,
  })
  expect(activeValue.value).toBeUndefined()
  expect(activeItem.value).toBeUndefined()
})

it('auto select', () => {
  const { activeValue, activeItem } = useSelect({
    items: [
      { value: 1, label: '一' },
      { value: 2, label: '二' },
      { value: 3, label: '三' },
      { value: 4, label: '四' },
      { value: 5, label: '五' },
    ],
    autoSelect: true,
  })
  expect(activeValue.value).toBe(1)
  expect(activeItem.value).toEqual({ value: 1, label: '一' })
})

it('disabled', () => {
  const { activeValue, activeItem } = useSelect({
    items: [
      { value: 1, label: '一', disabled: true, },
      { value: 2, label: '二' },
      { value: 3, label: '三' },
      { value: 4, label: '四' },
      { value: 5, label: '五' },
    ],
    autoSelect: true,
  })
  expect(activeValue.value).toBe(2)
  expect(activeItem.value).toEqual({ value: 2, label: '二' })
})

it('all disabled', () => {
  const { activeValue, activeItem } = useSelect({
    items: [
      { value: 1, label: '一', disabled: true, },
      { value: 2, label: '二', disabled: true, },
      { value: 3, label: '三', disabled: true, },
      { value: 4, label: '四', disabled: true, },
      { value: 5, label: '五', disabled: true, },
    ],
    autoSelect: true,
  })
  expect(activeValue.value).toBeUndefined()
  expect(activeItem.value).toBeUndefined()
})

it('NaN value', () => {
  const { activeValue, activeItem } = useSelect({
    items: [
      { value: NaN, label: 'NaN' },
      { value: 2, label: '二' },
      { value: 3, label: '三' },
      { value: 4, label: '四' },
      { value: 5, label: '五' },
    ],
    autoSelect: true,
  })
  expect(activeValue.value).toBeNaN()
  expect(activeItem.value).not.toBeUndefined()
})

it('activeValue(static)', () => {
  const { activeValue, activeItem } = useSelect({
    items: [
      { value: 1, label: '一' },
      { value: 2, label: '二' },
      { value: 3, label: '三' },
      { value: 4, label: '四' },
      { value: 5, label: '五' },
    ],
    autoSelect: true,
    initialValue: 3,
  })
  expect(activeValue.value).toBe(3)
  expect(activeItem.value).toEqual({ value: 3, label: '三' })
})

it('activeValue(reactive)', async() => {
  const value = ref(3)
  const { activeValue, activeItem } = useSelect({
    items: [
      { value: 1, label: '一' },
      { value: 2, label: '二' },
      { value: 3, label: '三' },
      { value: 4, label: '四' },
      { value: 5, label: '五' },
    ],
    autoSelect: true,
    initialValue: value,
  })
  expect(activeValue.value).toBe(3)
  expect(activeItem.value).toEqual({ value: 3, label: '三' })
  value.value = 4
  expect(activeValue.value).toBe(4)
  expect(activeItem.value).toEqual({ value: 4, label: '四' })
  await new Promise(resolve => setTimeout(resolve, 10))
  value.value = 5
  expect(activeValue.value).toBe(5)
  expect(activeItem.value).toEqual({ value: 5, label: '五' })
})

it('remove item', async() => {
  const { activeValue, activeItem, items, } = useSelect({
    items: [
      { value: 1, label: '一' },
      { value: 2, label: '二' },
      { value: 3, label: '三' },
      { value: 4, label: '四' },
      { value: 5, label: '五' },
    ],
    autoSelect: true
  })
  expect(activeValue.value).toBe(1)
  items.value.shift()
  await nextTick()
  expect(activeValue.value).toBe(2)
  expect(activeItem.value).toEqual({ value: 2, label: '二' })
})

it('add items', async() => {
  const { activeValue, activeItem, items, } = useSelect({
    items: [
      { value: 1, label: '一' },
      { value: 2, label: '二' },
      { value: 3, label: '三' },
      { value: 4, label: '四' },
      { value: 5, label: '五' },
    ],
    autoSelect: true
  })
  expect(activeValue.value).toBe(1)
  items.value.unshift({ value: 0, label: '零' })
  await nextTick()
  expect(activeValue.value).toBe(1)
})

it('update items', async() => {
  const { activeValue, activeItem, items, } = useSelect({
    items: [
      { value: 1, label: '一' },
      { value: 2, label: '二' },
      { value: 3, label: '三' },
      { value: 4, label: '四' },
      { value: 5, label: '五' },
    ],
    autoSelect: true
  })
  items.value[0].value = 11
  items.value[0].label = '十一'
  await nextTick()
  expect(activeValue.value).toBe(11)
  expect(activeItem.value).toEqual({ value: 11, label: '十一' })
})
