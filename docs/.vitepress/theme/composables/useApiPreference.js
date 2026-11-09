import { ref, watch } from 'vue'
import { inBrowser } from 'vitepress'

const STORAGE_KEY = 'panda-doc:api-preference'
const state = ref('options')
let initialized = false

export function useApiPreference() {
  return state
}

export function setApiPreference(value) {
  if (value === 'options' || value === 'composition') {
    state.value = value
  }
}

export function initApiPreference() {
  if (initialized || !inBrowser) return
  initialized = true

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'options' || saved === 'composition') {
      state.value = saved
    }
  } catch {
    // 隐私模式下 localStorage 可能不可用，保持默认值即可
  }

  watch(state, (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // 忽略写入失败
    }
  })
}
