import { MaybeRef } from '@vueuse/core'
import { computed, ComputedRef, Ref, ref } from 'vue'

interface UsePageOptions {
  page?: MaybeRef<number>
  pageSize?: MaybeRef<number>
  total?: MaybeRef<number>
  startPage?: number
}

interface UsePageReturn {
  page: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  pageCount: ComputedRef<number>
  hasPrev: ComputedRef<boolean>
  hasNext: ComputedRef<boolean>
}

export default function usePage(options: UsePageOptions = {}): UsePageReturn {
  const opts = options
  const page = ref(opts.page)
  const pageSize = ref(opts.pageSize)
  const total = ref(opts.total)
  const startPage = opts.startPage || 0

  const pageCount = computed(() => 0)
  const hasPrev = computed(() => false)
  const hasNext = computed(() => false)

  return {
    page,
    pageSize,
    total,
    pageCount,
    hasPrev,
    hasNext,
  }
}
