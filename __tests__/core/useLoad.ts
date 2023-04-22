import { reactive, ref } from 'vue'
import { useLoad } from '../../src/core'

function wait(timeout: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

describe('useLoad', () => {

  it('base', async() => {
    const { query, result, loading, load } = useLoad((query) => Promise.resolve([1, 2, 3].at(query.at)), {
      initialQuery: {
        at: 2
      }
    })

    expect(query.at).toBe(2)
    expect(result.value).toBe(undefined)
    expect(loading.value).toBe(false)

    await load()
    expect(result.value).toBe(3)
  })

  it('async', async() => {

    const { result, load } = useLoad(async() => {
      await wait(500)
      return 1
    })

    await load()

    expect(result.value).toBe(1)

  })

  it('disable loading load', async() => {
    const { loading, load } = useLoad(async() => {
      await wait(50)
      return 1
    })

    load(true)
    expect(loading.value).toBe(false)
  })

  it('link reactive query', async() => {
    const myQuery = reactive({
      a: 1
    })
    const { query } = useLoad(() => Promise.resolve([1, 2, 3]), {
      initialQuery: myQuery,
    })

    query.a = 2
    expect(myQuery.a).toBe(2)

    myQuery.a = 10
    expect(query.a).toBe(10)
  })

  it('link ref query', async() => {
    const myQuery = ref({
      a: 1
    })
    const { query } = useLoad(() => Promise.resolve(), {
      initialQuery: myQuery,
    })

    query.a = 2
    expect(myQuery.value.a).toBe(2)

    myQuery.value.a = 10
    expect(query.a).toBe(10)
  })

})
