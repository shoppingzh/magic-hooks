import { MaybeRef } from '@vueuse/core'
import { ComputedRef, Ref, computed, ref, watch } from 'vue'

export type SelectItemValue = string | number

interface BaseSelectItem {
  /** ID */
  value: SelectItemValue
  /** 标题 */
  label?: string
  /** 禁用 */
  disabled?: boolean
}
export interface SelectItem extends BaseSelectItem {
  [key: string]: any
}

interface UseSelectOptions<T extends BaseSelectItem> {
  /** 选项列表 */
  items: MaybeRef<T[]>
  /** 默认值 */
  initialValue?: MaybeRef<SelectItemValue>
  /** 当没有值选中时，是否自动选中 */
  autoSelect?: MaybeRef<boolean>
}

interface UseSelectReturn<T extends BaseSelectItem> {
  /** 选项列表 */
  items: Ref<T[]>
  /** 选中值 */
  activeValue: Ref<SelectItemValue>
  /** 选中项 */
  activeItem: ComputedRef<SelectItem>
}

function isSameValue(a: SelectItemValue, b: SelectItemValue) {
  return Object.is(a, b)
}

/**
 * 单选
 * 
 * @param options 
 * @returns 
 */
export default function useSelect<T extends BaseSelectItem>(options: UseSelectOptions<T>): UseSelectReturn<T> {
  const items = ref(options.items ?? []) as Ref<T[]>
  const autoSelect = ref(options.autoSelect ?? false)
  const activeValue = ref(options.initialValue)

  const safeItems = computed(() => items.value || [])
  const activeItem = computed(() => safeItems.value.find(o => isSameValue(o.value, activeValue.value)))

  function select() {
    if (!autoSelect.value) return
    if (activeItem.value && !activeItem.value.disabled) return

    // 没选中或选中的是禁用的，重新自动选择
    const firstEnableItem = safeItems.value.find(o => !o.disabled)
    activeValue.value = firstEnableItem?.value
  }

  watch([activeValue, items, autoSelect], select, { immediate: true, deep: true, })

  return {
    items,
    activeValue,
    activeItem,
  }
}
