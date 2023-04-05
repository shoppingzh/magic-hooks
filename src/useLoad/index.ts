import { MaybeRef, toReactive } from '@vueuse/core'
import { Ref, ref } from 'vue'

type LoadFn<R> = () => Promise<R>

interface UseLoadOptions<Q, R> {
  initialQuery?: MaybeRef<Q>
}

interface UseLoadReturn<Q, R> {
  query: Q
  result: Ref<R>
  loading: Ref<boolean>
  load: () => Promise<void>
}

export function useLoad<Q extends object = object, R = unknown>(
  fn: LoadFn<R>,
  options: UseLoadOptions<Q, R> = {}
): UseLoadReturn<Q, R> {
  const query = toReactive(options.initialQuery || {} as Q)
  const result = ref<R>()
  const loading = ref(false)

  function load() {
    return new Promise<void>(async(resolve, reject) => {
      try {
        if (!fn) return reject()
        await fn()

        resolve()
      } catch (err) {
        reject(err)
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
