import { MaybeRef, toReactive } from '@vueuse/core'
import { Ref, ref } from 'vue'

type LoadFn<Q, R> = (query: Q) => Promise<R>

interface UseLoadOptions<Q, R> {
  initialQuery?: MaybeRef<Q>
}

interface UseLoadReturn<Q, R> {
  query: Q
  result: Ref<R>
  loading: Ref<boolean>
  load: (disableLoading?: boolean) => Promise<void>
}

/**
 * 通用加载hooks，特性：
 * - 查询参数与加载数据
 * - 不限定加载源
 * @param fn 
 * @param options 
 * @returns 
 */
export function useLoad<Q extends object = object, R = unknown>(
  fn: LoadFn<Q, R>,
  options: UseLoadOptions<Q, R> = {}
): UseLoadReturn<Q, R> {
  const query = toReactive(options.initialQuery || {} as Q)
  const result = ref<R>()
  const loading = ref(false)

  function load(disableLoading = false) {
    return new Promise<void>(async(resolve, reject) => {
      try {
        if (!fn) return reject()
        if (!disableLoading) {
          loading.value = true
        }
        result.value = await fn(query)

        resolve()
      } catch (err) {
        reject(err)
      } finally {
        loading.value = false
      }
    })
  }

  return {
    query,
    result,
    loading,
    load,
  }
}
