
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';


import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import Notifications from 'notiwind'

import 'aos/dist/aos.css';
import './css/style.css'

const app = createApp(App)
app.use(router)
app.use(Notifications)
app.mount('#app')
