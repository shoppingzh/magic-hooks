import { MaybeRef } from '@vueuse/core'
import { onUnmounted, ref, shallowRef, watch } from 'vue'

interface Options {
  el: MaybeRef<HTMLElement>
}

export default function useElementVisible(options: Options) {
  const isSupported = 'IntersectionObserver' in window
  const visible = ref(!isSupported)
  const el = ref(options.el)
  const observer = shallowRef<IntersectionObserver>()

  function observe() {
    if (!el.value || observer.value) return

    observer.value = new IntersectionObserver((entries) => {
      if (!entries || !entries.length) return
      visible.value = entries[0].isIntersecting
    })
    observer.value.observe(el.value)
  }

  function destroy() {
    if (!observer.value) return
    observer.value.disconnect()
    observer.value = null
  }

  watch(el, observe)
  onUnmounted(destroy)

  return visible
}
