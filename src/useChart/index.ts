import { MaybeRef, useResizeObserver, useThrottleFn } from '@vueuse/core'
import * as echarts from 'echarts'
import { Ref, ShallowRef, onUnmounted, ref, shallowRef, watch } from 'vue'
import { merge } from 'lodash'
import useElementVisible from './useElementVisible'


export interface UseChartOptions {
  el?: MaybeRef<HTMLElement>
  /** 加载状态 */
  loading?: MaybeRef<boolean>
  /** 加载状态风格配置 */
  loadingOptions?: object // TODO 类型
  /** ehcarts配置项 */
  option?: Ref<echarts.EChartsOption>
  /** 主题 */
  theme?: MaybeRef<string>
  /** 重置大小间隔 */
  resizeDuration?: number
  /** 懒渲染 !!请在项目中测试功能的可用性，在不支持的浏览器中该功能将失效 */
  lazyRender?: MaybeRef<boolean>
}

export interface UseChartReturn {
  el: Ref<HTMLElement>
  loading: Ref<boolean>
  /** 图表实例 */
  instance: ShallowRef<echarts.EChartsType>
  option: Ref<echarts.EChartsOption>
  theme: Ref<string>
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
 * 5. 动态换肤
 * 6. 懒渲染
 * @param options 
 * @returns 
 */
export default function(options: UseChartOptions = {}): UseChartReturn {
  const opts = merge({}, DEFAULT_OPTIONS, options)
  const el = ref(opts.el)
  const instance = shallowRef<echarts.EChartsType>()
  const loading = ref(opts.loading || false)
  const option = ref(opts.option)
  const theme = ref(opts.theme)
  const lazyRender = ref(opts.lazyRender)
  const visible = useElementVisible({ el }) // Vueuse useElementVisibility有问题，自己实现

  /**
   * 初始化
   * @param force 强制初始化，设置为true时，无论实例是否已存在，都重新初始化
   */
  function init(force?: boolean) {
    if (!el.value) return
    if (lazyRender.value && !visible.value) return
    if (!force && instance.value) return // 不强制初始化
    instance.value = echarts.init(el.value, theme.value)
  }

  /**
   * 销毁
   */
  function destroy() {
    if (!instance.value) return
    if (instance.value.isDisposed()) return
    instance.value.dispose()
    instance.value = null
  }

  function reinit() {
    destroy()
    init()
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


  // 元素变化，重新初始化
  watch(el, () => reinit(), { immediate: true })
  // 元素出现，初始化，懒渲染
  watch(visible, () => init(), { immediate: true })
  // 元素容器大小变化，重置图表大小
  useResizeObserver(el, useThrottleFn(resize, 300))
  // 配置项变化，重绘
  watch([instance, option], () => render(), { deep: true })
  // 加载态变化，更新加载
  watch([instance, loading], () => updateLoading())
  // 主题变化，重绘
  watch(theme, () => {
    // FIXME 注：echarts暂不支持动态换肤，需要先销毁实例重新初始化
    // 详情请见：https://github.com/apache/echarts/issues/4607
    reinit()
  })
  // 销毁
  onUnmounted(() => destroy())

  return {
    el,
    loading,
    instance,
    option,
    theme,
  }
}
