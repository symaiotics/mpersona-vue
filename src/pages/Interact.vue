<template>
  <div class="flex flex-col min-h-screen overflow-hidden">

    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="grow">



      <!-- Page illustration -->
      <div class="relative max-w-9xl mx-auto h-0 pointer-events-none -z-1" aria-hidden="true">
        <PageIllustration />
      </div>

      <section class="relative">
        <div class="max-w-9xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">



            <template v-if="!selectedPersona">
              <Personas />

            </template>
            <template v-if="selectedPersona">
              <div class="flex mb-4 relative">

                <!-- Left -->
                <div class="w-1/2">
                  <!-- Page header -->



                  <div class="max-w-3xl mx-auto text-center  ">
                    <h2 class="h2 font-red-hat-display mb-4">Interact</h2>
                    <p class="text-xl text-gray-600 dark:text-gray-400">Begin chatting with {{
                      selectedPersona?.name }} </p>
                  </div>

                  <div class="flex flex-wrap -mx-3">
                    <div class="w-full px-3 m-6">
                      <div class="flex justify-between items-center mb-1">
                      </div>

                      <textarea v-model="userPrompt" id="response" rows="8" class="form-textarea w-full mb-2"
                        placeholder="Enter your prompts here"></textarea>

                      <p> Below are your Persona instructions. Refine them to meet your needs.</p>
                      <textarea v-model="selectedPersona.basePrompt" id="response" rows="4" class="form-textarea w-full"
                        placeholder="User the instructions"></textarea>


                      <div class="w-full">
                        <button @click="doPrompt"
                          class="btn text-black bg-teal-500 hover:bg-teal-400 w-full flex items-center mt-3">
                          <span>Prompt</span>
                          <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                            <path class="fill-current"
                              d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                          </svg>
                        </button>


                        <button @click="reset"
                          class="btn text-black bg-yellow-500 hover:bg-teal-400 w-full flex items-center mt-3">
                          <span>Reset</span>

                        </button>

                      </div>



                    </div>
                  </div>


                </div>

                <!-- Right -->
                <div class="w-1/2">
                  <!-- Page header -->
                  <div class="max-w-3xl mx-auto text-center">
                    <h2 class="h2 font-red-hat-display mb-4">Results</h2>
                    <p class="text-xl text-gray-600 dark:text-gray-400">Status: {{ status }}<b></b></p>

                    <!-- <p class="text-xl text-gray-600 dark:text-gray-400">Interact with your Persona</p> -->
                  </div>

                  <div class="flex flex-wrap -mx-3">
                    <div class="w-full px-3 m-6">
                      <div class="flex justify-between items-center mb-1">
                      </div>
                      <div v-html="promptResponse" class=" w-full form-textarea w-full" style="min-height:200px;"></div>



                      <template v-if="promptResponseCode && promptResponseCode.length">
                        <br />
                        <p>Segements of code (if provided) are identified below:</p>
                        <template v-for="code in promptResponseCode">
                          <div v-html="code.code" class=" w-full form-textarea w-full" style="min-height:200px;">
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>


                </div>


              </div>

            </template>

          </div>
        </div>
      </section>


    </main>

    <!-- Site footer -->
    <!-- <Footer /> -->

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import Header from './../partials/Header.vue'
import PageIllustration from './../partials/PageIllustration.vue'
import Footer from './../partials/Footer.vue'
import Personas from '@/partials/Personas.vue'


import { usePrompts } from '@/composables/usePrompts.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'
const { personas, selectedPersona, usedCategories, skills, getPersonas, getSkills, getUsedCategories } = usePersonas()
const { categories, selectedCategory, getCategories, createAdminCategories } = useCategories()

const { promptOpenAI, promptResponse, promptResponseCode } = usePrompts()

let userPrompt = ref("");
let status = ref("Waiting");



onMounted(() => {
  //Personas
  getPersonas();

  //Categories
  getUsedCategories();

})


function doPrompt() {

  try {
    status.value = "Processing";
    promptOpenAI(userPrompt.value, selectedPersona.value.basePrompt).then((response) => {
      status.value = "Waiting"
    }).catch((error) => {
      console.log("Error completing prompt", error)
    })
  }
  catch (error) {
    console.log('Error', error)
  }

}


function reset() {
  selectedPersona.value = null;
}
</script>
