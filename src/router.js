import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
// import Create from '@/pages/Create.vue'
import Interact from '@/pages/Interact.vue'
import InteractLive from '@/pages/InteractLive.vue'
import NewPersonas from '@/pages/NewPersonas.vue'
import Join from '@/pages/Join.vue'
import Login from '@/pages/Login.vue'
import KnowledgeProfiles from '@/pages/KnowledgeProfiles.vue'
import LinkPersona from '@/pages/LinkPersona.vue'
import LinkKnowledgeProfile from '@/pages/LinkKnowledgeProfile.vue'


import Testimonials from './pages/Testimonials.vue'
import Blog from './pages/Blog.vue'
import BlogPost from './pages/BlogPost.vue'
import About from './pages/About.vue'
import Contact from './pages/Contact.vue'
import Help from './pages/Help.vue'
import PageNotFound from './pages/PageNotFound.vue'

const routerHistory = createWebHistory()

const router = createRouter({
  scrollBehavior(to) {
    if (to.hash) {
      window.scroll({ top: 0 })
    } else {
      document.querySelector('html').style.scrollBehavior = 'auto'
      window.scroll({ top: 0 })
      document.querySelector('html').style.scrollBehavior = ''
    }
  },
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/knowledgeProfiles',
      name: 'knowledgeProfiles',
      component: KnowledgeProfiles
    },
    {
      path: '/interact',
      name: 'interact',
      component: InteractLive
    },
    {
      path: '/interactLive',
      name: 'interactLive',
      component: InteractLive
    },
    {
      path: '/personas',
      name: 'personas',
      component: NewPersonas
    },
    {
      path: '/join',
      name: 'join',
      component: Join
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/linkPersona/:link?',
      name: 'linkPersona',
      component: LinkPersona,
      props: true
    },
    {
      path: '/linkKnowledgeProfile/:link?',
      name: 'linkKnowledgeProfile',
      component: LinkKnowledgeProfile,
      props: true
    },
    // {
    //   path: '/testimonials',
    //   component: Testimonials
    // },
    // {
    //   path: '/blog',
    //   component: Blog
    // },
    // {
    //   path: '/blog-post',
    //   component: BlogPost
    // },
    // {
    //   path: '/about',
    //   component: About
    // },
    // {
    //   path: '/contact',
    //   component: Contact
    // },
    // {
    //   path: '/help',
    //   component: Help
    // },
    {
      path: '/:pathMatch(.*)*',
      component: PageNotFound
    }
  ]
})

export default router
