import TinySearchBox from '@opentiny/vue-search-box'
import { createApp } from 'vue'
import { setNavigator } from '@opentiny/next-sdk'
import globalComponents from '@/components'
import { runSeeds } from '@/store/seedLoader'
import App from './App.vue'
import directive from './directive'
import i18n from './locale'
import router from './router'
import store from './store'
import '@/api/interceptor'
import '@/assets/style/global.less'
import '@opentiny/vue-search-box/dist/index.css'
import 'virtual:uno.css'
import '@opentiny/icons/style/all.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(i18n({ locale: localStorage.getItem('tiny-locale') }))
app.use(globalComponents)
app.use(directive)
app.use(TinySearchBox)

// 加载 seed 数据
runSeeds({ version: '1.0.0' }).then(() => {
  console.log('[Seed] Data loaded successfully')
}).catch((error) => {
  console.error('[Seed] Failed to load data:', error)
})

app.mount('#app')

// 必须在 router 注册后调用，让 SDK 持有 router.push 的引用
setNavigator((route) => router.push(route))
