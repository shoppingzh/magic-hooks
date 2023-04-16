import { MaybeRef, useResizeObserver, useThrottleFn } from '@vueuse/core'
import * as echarts from 'echarts'
import { Ref, ShallowRef, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { merge } from 'lodash'

export interface UseChartOptions {
  el?: MaybeRef<HTMLElement>
  loading?: MaybeRef<boolean>
  option?: Ref<echarts.EChartsOption>
  resizeDuration?: number
  loadingOptions?: object
}

export interface UseChartReturn {
  el: Ref<HTMLElement>
  loading: Ref<boolean>
  instance: ShallowRef<echarts.EChartsType>
  option: Ref<echarts.EChartsOption>
}

const DEFAULT_OPTIONS: UseChartOptions = {
  resizeDuration: 0,
  loadingOptions: {
    text: '加载中..',
    spinnerRadius: 10,
    lineWidth: 2,
    textColor: '#333'
  }
}

/**
 * 基础图表hooks，支持以下功能：
 * 1. 根据配置自动渲染图表，组件销毁时自动销毁图表实例
 * 2. 加载状态
 * 3. 当容器大小发生变化时，自动重绘图表
 * 4. 当配置项发生变化时，自动重绘图表
 * @param options 
 * @returns 
 */
export function useChart(options: UseChartOptions = {}): UseChartReturn {
  const opts = merge({}, DEFAULT_OPTIONS, options)
  const el = ref(opts.el)
  const instance = shallowRef<echarts.EChartsType>()
  const loading = ref(opts.loading || false)
  const option = ref(opts.option)

  function init() {
    instance.value = echarts.init(el.value)
  }

  function destroy() {
    if (!instance.value) return
    instance.value.dispose()
    instance.value = null
  }

  function resize() {
    if (!instance.value) return
    instance.value.resize({
      animation: {
        duration: opts.resizeDuration,
      }
    })
  }

  function render() {
    if (!instance.value || !option.value) return
    instance.value.setOption(option.value, {
      notMerge: true,
      lazyUpdate: true,
    })
  }


  function updateLoading() {
    if (!instance.value) return
    if (loading.value) {
      instance.value.showLoading('default', opts.loadingOptions)
    } else {
      instance.value.hideLoading()
    }
  }

  onMounted(init)
  onUnmounted(destroy)

  useResizeObserver(el, useThrottleFn(resize, 500))

  watch([instance, option], render, { deep: true })
  watch([instance, loading], updateLoading)

  return {
    el,
    loading,
    instance,
    option,
  }
}
