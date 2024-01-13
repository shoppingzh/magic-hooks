import { MaybeRef } from '@vueuse/core'
import { ComputedRef, Ref, computed, ref, watch } from 'vue'

export type SelectItemValue = string | number | boolean

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

interface UseSelectOptions {
  /** 选项列表 */
  items: MaybeRef<SelectItem[]>
  /** 默认值 */
  initialValue?: MaybeRef<SelectItemValue>
  /** 当没有值选中时，是否自动选中 */
  autoSelect?: boolean
}

interface UseSelectReturn {
  /** 选项列表 */
  items: Ref<SelectItem[]>
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
export default function useSelect(options: UseSelectOptions): UseSelectReturn {
  const items = ref(options.items ?? [])
  const safeItems = computed(() => items.value || [])
  const activeValue = ref(options.initialValue)
  const activeItem = computed(() => safeItems.value.find(o => isSameValue(o.value, activeValue.value)))

  function autoSelect() {
    // 没选中或选中的是禁用的，重新自动选择
    if (!activeItem.value || activeItem.value.disabled) {
      const firstEnableItem = safeItems.value.find(o => !o.disabled)
      activeValue.value = firstEnableItem ? firstEnableItem.value : undefined
    }
  }

  if (options.autoSelect) {
    watch([activeValue, items], () => {
      autoSelect()
    }, {
      immediate: true,
      deep: true,
    })
  }

  return {
    items,
    activeValue,
    activeItem,
  }
}
