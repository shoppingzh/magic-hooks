import { isRef } from 'vue'
import useChart from '../src/useChart/index'

describe('useChart', () => {

  it('base', () => {

    const { el, instance, loading, option, theme } = useChart({

    })

    expect(
      [isRef(el), isRef(loading), isRef(option)]
    ).toEqual([true, true, true])

    expect(el.value).toBe(undefined)

  })

})
