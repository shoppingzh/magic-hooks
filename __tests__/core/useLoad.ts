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

})
