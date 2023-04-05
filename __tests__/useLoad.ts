import { useLoad } from '../src'

describe('useLoad', () => {

  it('base', () => {
    const { query, result, loading } = useLoad(() => Promise.resolve([1, 2, 3]), {
      initialQuery: {
        at: 2
      }
    })
  })

})
