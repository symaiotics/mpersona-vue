
// import 'reveal.js/dist/reveal.css';
// import 'reveal.js/dist/theme/moon.css';

// import GAuth from 'vue-google-oauth2'

// const gauthOption = {
//   clientId: '601202775910-c9v9k03qippsb467vov1au393fmd4fog.apps.googleusercontent.com',
//   scope: 'profile email',
//   prompt: 'select_account'
// }



import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import Notifications from 'notiwind'

import 'aos/dist/aos.css';
import './css/style.css'

const app = createApp(App)
app.use(router)
app.use(Notifications)
// app.use(GAuth, gauthOption)
app.mount('#app')

