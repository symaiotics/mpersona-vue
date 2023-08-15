<template>
  <div class="flex flex-col min-h-screen overflow-hidden">

    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="grow">

      <!-- Page illustration -->
      <div class="relative max-w-6xl mx-auto h-0 pointer-events-none -z-1" aria-hidden="true">
        <PageIllustration />
      </div>

      <!-- Page sections -->
      <HeroHome />
      <Stats />
      <Carousel />
      <Personas />
      <!-- <Process />
      <PricingTables />
      <TestimonialsBlocks />
      <FeaturesBlocks />
      <Cta /> -->

    </main>

    <!-- Site footer -->
    <!-- <Footer /> -->

  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import Header from '@/partials/Header.vue'
import PageIllustration from '@/partials/PageIllustration.vue'
import HeroHome from '@/partials/HeroHome.vue'
import Stats from '@/partials/Stats.vue'
import Carousel from '@/partials/Carousel.vue'
import Personas from '@/partials/Personas.vue'
import Process from '@/partials/Process.vue'
import PricingTables from '@/partials/PricingTables.vue'
import TestimonialsBlocks from '@/partials/TestimonialsBlocks.vue'
import FeaturesBlocks from '@/partials/FeaturesBlocks.vue'
import Cta from '@/partials/Cta.vue'
import Footer from '@/partials/Footer.vue'

//composables
import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'
const { personas, usedCategories, skills, getPersonas, getSkills, getUsedCategories } = usePersonas()
const { categories, getCategories, createAdminCategories } = useCategories()

onMounted(() => {
  console.log("Accessing the API at", import.meta.env.VITE_API_URL)

  //Personas
  getPersonas();
  getSkills();

  //Categories
  getUsedCategories();
  createAdminCategories();

})



</script>