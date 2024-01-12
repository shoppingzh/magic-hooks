import { MaybeRef, useIntersectionObserver, useResizeObserver, useThrottleFn } from '@vueuse/core'
import * as echarts from 'echarts'
import { Ref, ShallowRef, onUnmounted, ref, shallowRef, watch } from 'vue'
import { merge } from 'lodash'


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

function useElementVisible(el: MaybeRef<HTMLElement>) {
  const visible = ref(false)
  const { isSupported } = useIntersectionObserver(el, (entries) => {
    if (!entries || !entries.length) return
    visible.value = entries[0].isIntersecting
  })
  if (!isSupported.value) { // 降级处理：不支持时，默认都显示
    visible.value = true
  }
  return visible
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
  const visible = useElementVisible(el) // Vueuse useElementVisibility有问题，自己实现

  function init(force?: boolean) {
    if (!el.value) return
    if (lazyRender.value && !visible.value) return
    if (!force && instance.value) return // 不强制初始化
    instance.value = echarts.init(el.value, theme.value)
  }

  function destroy() {
    if (!instance.value) return
    if (instance.value.isDisposed()) return
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

  // 元素存在时，渲染
  watch(el, () => init(), { immediate: true })
  watch(visible, () => {
    init()
  })
  // 销毁
  onUnmounted(destroy) // FIXME watch el el变为空，也需要销毁
  // 元素容器大小变化，重置图表大小
  useResizeObserver(el, useThrottleFn(resize, 500))
  // 配置项变化，重绘
  watch([instance, option], render, { deep: true })
  // 加载态变化，更新加载
  watch([instance, loading], updateLoading)
  // 主题变化，重绘
  watch(theme, () => {
    // FIXME 注：echarts暂不支持动态换肤，需要先销毁实例重新初始化
    // 详情请见：https://github.com/apache/echarts/issues/4607
    destroy()
    init()
  })

  return {
    el,
    loading,
    instance,
    option,
    theme,
  }
}
