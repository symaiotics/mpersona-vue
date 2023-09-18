import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Create from '@/pages/Create.vue'
import Interact from '@/pages/Interact.vue'
import InteractLive from '@/pages/InteractLive.vue'
import Manage from '@/pages/Manage.vue'
import Join from '@/pages/Join.vue'
import Login from '@/pages/Login.vue'
import CreateKnowledgeProfile from '@/pages/CreateKnowledgeProfile.vue'


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
      name:'home',
      component: Home
    },
    {
      path: '/create',
      name:'create',
      component: Create
    },
    {
      path: '/createKp',
      name:'createKp',
      component: CreateKnowledgeProfile
    },
    {
      path: '/interact',
      name:'interact',
      component: InteractLive
    },
    {
      path: '/interactLive',
      name:'interactLive',
      component: InteractLive
    },
    {
      path: '/manage',
      name:'manage',
      component: Manage
    },
    {
      path: '/join',
      name:'join',
      component: Join
    },
    {
      path: '/login',
      name:'login',
      component: Login
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
