import useLoad, { LoadFn, UseLoadReturn, UseLoadOptions } from '@/useLoad'
import { MaybeRef } from '@vueuse/core'
import { Ref, ref } from 'vue'

interface PageResult<T> {
  page?: number
  pageSize?: number
  total?: number
  list?: T[]
}

type Result<T> = T[] | PageResult<T>

export interface UseLoadListOptions<Q, R> extends Partial<Pick<UseLoadOptions<Q, R>, 'initialQuery'>> {
  page?: MaybeRef<number>
  pageSize?: MaybeRef<number>
}

export interface UseLoadListReturn<Q, R> extends Pick<UseLoadReturn<Q, R>, 'query' | 'loading'> {
  list: Ref<R[]>
  page: Ref<number>
  pageSize: Ref<number>
}

const START_PAGE = 0
const DEFAULT_PAGE_SIZE = 15

export default function<Q extends object, R>(
  loadFn: LoadFn<Q, Result<R>>,
  options: UseLoadListOptions<Q, R> = {}
): UseLoadListReturn<Q, R> {
  const opts = options
  const { result: list, query, loading, load: doLoad } = useLoad(wrapLoad, {
    initialQuery: options.initialQuery,
  })
  const page = ref(opts.page == null ? START_PAGE : opts.page)
  const pageSize = ref(opts.pageSize == null ? DEFAULT_PAGE_SIZE : opts.pageSize)
  const total = ref(0)

  async function wrapLoad() {
    const result = await loadFn(query)
    let pageResult: PageResult<R> = (result as PageResult<R>)
    if (!result || !Array.isArray(result)) {
      const list = (result as R[]) || []
      pageResult = {
        page: START_PAGE,
        pageSize: list.length,
        total: list.length,
        list,
      }
    }

    total.value = pageResult.total || 0

    return pageResult.list
  }

  return {
    query,
    list,
    loading,

    page,
    pageSize,
  }
}
