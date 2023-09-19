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

      <section class="relative">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">

            <!-- Page header -->
            <div class="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h1 class="h1 font-red-hat-display mb-4">Accept Link</h1>
              <p class="text-xl text-gray-600 dark:text-gray-400">Add a shared link to your account.</p>
              <!-- <p>{{ props.personaLink }}</p> -->
            </div>

            <!-- Contact form -->

            <div v-if="tokenDecoded && !linkInvalid" class="flex flex-wrap -mx-3 items-center justify-center">
              <div class="w-full px-3 mb-4 text-center">
                <div>
                  <DisplayPersona alignment="center" :persona="offeredPersona"  />
                  Accepting this link will add the Persona into your account. You will then be able to view and interact
                  with it.
                </div>
              </div>


              <div class="flex flex-wrap mx-auto -mx-3 mt-6 ">
                <div class="w-full px-3">
                  <button @click="acceptLink"
                    class="btn text-black bg-teal-500 hover:bg-teal-400 w-full flex items-center mb-3">
                    <span>Accept Link</span>
                  </button>

                  If you do not want to accept this link, just go back to the home page or close this browser.

                </div>
              </div>

            </div>

            <div v-if="!tokenDecoded && !linkInvalid" class=" flex flex-wrap mx-auto -mx-3 ">
              <div class="w-full  px-3 mb-4  text-center ">
                You have to be logged in to accept this link. Please login and follow the link again.
              </div>
            </div>

            <div v-if="linkInvalid" class=" flex flex-wrap mx-auto -mx-3 ">
              <div class="w-full  px-3 mb-4  text-center ">
                Sorry, this link does not appear to be valid. Request a new link from the Persona owner.
              </div>
            </div>


          </div>
        </div>
      </section>

    </main>

    <!-- Site footer -->
    <Footer />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

//Plugins
import { useRouter, useRoute } from 'vue-router'

//Components
import Header from './../partials/Header.vue'
import PageIllustration from './../partials/PageIllustration.vue'
import Footer from './../partials/Footer.vue'
import DisplayPersona from '@/components/DisplayPersona.vue';

//Composables
import { notify } from "notiwind"

import { useTokens } from '@/composables/useTokens.js'
import { usePersonas } from '@/composables/usePersonas.js'
const { tokenDecoded } = useTokens()
const { getPersonaLinkDetails, acceptPersonaLink } = usePersonas()

const router = useRouter()
let props = defineProps({ personaLink: { type: String, default: null } })
let offeredPersona = ref(null)
let linkInvalid = ref(false)

onMounted(() => {
  if (props.personaLink)
    getPersonaLinkDetails(props.personaLink).then((results) => {
      offeredPersona.value = results;
    }).catch((error) => {
      linkInvalid.value = true;
    })
})

function acceptLink() {
  acceptPersonaLink(props.personaLink).then((results) => {
    notify({ group: "success", title: "Success", text: "Persona accepted successfully" }, 4000) // 4s
    router.push({ name: 'home' })
  }).catch((error) => {
    console.log("Error", error)
    notify({ group: "failure", title: "Error", text: "Error accepting persona. Please try again or request a new link." }, 4000) // 4s
  })
}
</script>
