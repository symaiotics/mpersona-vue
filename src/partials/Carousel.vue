<template>
  <section class="border-t border-transparent dark:border-gray-800">
    <div class="py-12 md:py-20">

      <div class="max-w-6xl mx-auto px-4 sm:px-6">

        <!-- Section header -->
        <div class="max-w-3xl mx-auto text-center pb-12 md:pb-16">
          <h1 class="h2 font-red-hat-display mb-4">Personas drive Large Language Model (LLM) Interactions</h1>
          <p class="text-xl text-gray-600 dark:text-gray-400">Leverage a sophisticated roster of community-built personas to support your interactions.</p>
          <br/>
          <!-- <p class="text-xl text-gray-600 dark:text-gray-400">Best of all this is 100% open source. </p> -->
          <p class="text-xl text-gray-600 dark:text-gray-400"> Deploy mPersona to your own Cloud or to a secure data centre.</p>
        </div>

      </div>
 

    </div>
  </section>
</template>

<script>
// Import Swiper
import Swiper, { Autoplay, Navigation } from 'swiper'
import 'swiper/css'
Swiper.use([Autoplay, Navigation])

export default {
  name: 'Carousel',
  mounted() {
    // eslint-disable-next-line no-unused-vars
    const carousel = new Swiper('.carousel', {
      slidesPerView: 'auto',
      grabCursor: true,
      loop: true,
      centeredSlides: true,
      initialSlide: 1,
      spaceBetween: 24,
      autoplay: {
        delay: 7000,
      },
      navigation: {
        nextEl: '.carousel-next',
        prevEl: '.carousel-prev',
      },
    })
  }
}
</script>