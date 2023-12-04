import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'

import InteractLive from '@/pages/InteractLive.vue'
import NewPersonas from '@/pages/NewPersonas.vue'
import Join from '@/pages/Join.vue'
import Login from '@/pages/Login.vue'
import KnowledgeProfiles from '@/pages/KnowledgeProfiles.vue'
import LinkPersona from '@/pages/LinkPersona.vue'
import LinkRoster from '@/pages/LinkRoster.vue'
import LinkKnowledgeProfile from '@/pages/LinkKnowledgeProfile.vue'
import Assist from '@/pages/Assist.vue'
import Chat from '@/pages/Chat.vue'
import FT from '@/pages/apps/FT.vue'
import GC from '@/pages/apps/GC.vue'
import GOV from '@/pages/apps/GOV.vue'
import OCCSC from '@/pages/apps/OCCSC.vue'

import Blog from './pages/Blog.vue'
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
      path: '/blog',
      name: 'blog',
      component: Blog
    },

    {
      path: '/help',
      name: 'help',
      component: Help
    },
    {
      path: '/chat/:personaId?',
      name: 'chat',
      component: Chat,
      props:true,
    },
    {
      path: '/apps/ft/:rosterId?',
      name: 'ft',
      component: FT,
      props:true,
    },
    {
      path: '/apps/gc/:rosterId?',
      name: 'gc',
      component: GC,
      props:true,
    },
    {
      path: '/apps/gov/:personaId?',
      name: 'gov',
      component: GOV,
      props:true,
    },
    {
      path: '/apps/occsc/:rosterId?',
      name: 'occsc',
      component: OCCSC,
      props:true,
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
      path: '/linkRoster/:link?',
      name: 'linkRoster',
      component: LinkRoster,
      props: true
    },    
    
    {
      path: '/assist/:code?',
      name: 'assist',
      component: Assist,
      props: true
    },
    {
      path: '/linkKnowledgeProfile/:link?',
      name: 'linkKnowledgeProfile',
      component: LinkKnowledgeProfile,
      props: true
    },
   
    {
      path: '/:pathMatch(.*)*',
      component: PageNotFound
    }
  ]
})

export default router
