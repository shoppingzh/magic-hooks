import { MaybeRef, toReactive } from '@vueuse/core'
import { ComputedRef, Ref, computed, ref } from 'vue'

export type LoadFn<Q, R> = (query: Q) => Promise<R>

export interface UseLoadOptions<Q, R> {
  /** 初始查询条件 */
  initialQuery?: MaybeRef<Q>
  /** 默认加载结果 */
  initialResult?: MaybeRef<R>
  /** 加载中状态 */
  loading?: MaybeRef<boolean>
  /** 自动加载 */
  autoLoad?: boolean
}

export interface UseLoadReturn<Q, R> {
  /** 查询条件 */
  query: Q
  /** 结果 */
  result: Ref<R>
  /** 加载中状态 */
  loading: Ref<boolean>
  /** 加载完成状态(只读) */
  loaded: ComputedRef<boolean>
  /** 加载 */
  load: (disableLoading?: boolean) => Promise<void>
}

/**
 * 通用加载hooks，特性：
 * - 查询参数与加载数据
 * - 不限定加载源
 * - 加载完成状态
 * 
 * @param onLoad 
 * @param options 
 * @returns 
 */
export default function<Q extends object = object, R = unknown>(
  onLoad: LoadFn<Q, R>,
  options: UseLoadOptions<Q, R> = {}
): UseLoadReturn<Q, R> {
  const opts = options
  const query = toReactive(opts.initialQuery || {} as Q) as Q
  const result = ref(opts.initialResult) as Ref<R>
  const loading = ref(options.loading ?? false)
  const loaded = ref(false)

  function load(disableLoading = false) {
    return new Promise<void>(async(resolve, reject) => {
      try {
        if (!onLoad) return reject()
        if (!disableLoading) {
          loading.value = true
        }
        result.value = await onLoad(query)
        loaded.value = true

        resolve()
      } catch (err) {
        loaded.value = false
        reject(err)
      } finally {
        loading.value = false
      }
    })
  }

  if (opts.autoLoad) {
    load()
  }

  return {
    query,
    result,
    loading,
    loaded: computed(() => loaded.value),
    load,
  }
}
