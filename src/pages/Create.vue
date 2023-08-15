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

            <!-- Page header -->
            <div class="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h1 class="h1 font-red-hat-display mb-4">Create a Persona</h1>
              <p class="text-xl text-gray-600 dark:text-gray-400">Build your own persona to enable your AI worker.</p>
            </div>

            <!-- Contact form -->
            <div class="max-w-xl mx-auto">
              <div class="flex flex-wrap -mx-3 mb-1">

                <!-- {{ newPersona }} -->

                <div class="w-full  px-3 mb-4 md:mb-1">
                  <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="first-name">
                    Persona Name
                    <span class="text-red-600">*</span>
                  </label>
                  <input v-model="newPersona.name" id="first-name" type="text" class="form-input w-full"
                    placeholder="Enter the name of the persona" required />
                </div>

                <div class="w-full  px-3 mb-4 md:mb-1">
                  <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                    for="persona-description">
                    Description
                    <span class="text-sm text-gray-500">Optional</span>

                  </label>
                  <input v-model="newPersona.description.en" id="persona-description" type="text"
                    class="form-input w-full" placeholder="Enter a brief description" required />
                </div>

                <!-- <div class="w-full md:w-1/2 px-3">
                  <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="last-name">Last Name <span class="text-red-600">*</span></label>
                  <input id="last-name" type="text" class="form-input w-full" placeholder="Enter your last name" required />
                </div> -->
              </div>
              <!-- <div class="flex flex-wrap -mx-3 mb-5">
                <div class="w-full px-3">
                  <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="company">Company <span class="text-red-600">*</span></label>
                  <input id="company" type="text" class="form-input w-full" placeholder="Enter your company name" required />
                </div>
              </div>
              <div class="flex flex-wrap -mx-3 mb-5">
                <div class="w-full px-3">
                  <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="phone">Phone Number <span class="text-red-600">*</span></label>
                  <input id="phone" type="tel" class="form-input w-full" placeholder="Enter your phone number" required />
                </div>
              </div> -->
              <div class="flex flex-wrap -mx-3 mb-1">
                <div class="w-full px-3">
                  <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="category">Category
                    <span class="text-red-600">*</span></label>
                  <select v-model="newPersona.categories" id="category" class="form-select w-full" required>
                    <option v-for="(category, index) in categories" :key="'category' + index" :value="[category]">{{
                      category.label.en }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="flex flex-wrap -mx-3 mb-5">
                <div class="w-full px-3">
                  <div class="flex justify-between items-center mb-1">
                    <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium" for="message">
                      Persona Instructions
                    </label>
                    <span class="text-sm text-gray-500">Required</span>
                  </div>
                  <textarea v-model="newPersona.basePrompt" id="message" rows="8" class="form-textarea w-full"
                    placeholder="Define the persona instructions" required></textarea>
                  <p> The Persona Instructions determine how the Large Language Model will conduct its interactions. Here,
                    you can define the rules by which it should operate, how it identifies itself, and the functions it
                    provides.</p>

                </div>
              </div>
              <!-- <div class="flex flex-wrap -mx-3 mb-5">
                <div class="w-full px-3">
                  <div class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-3">Tell us about your role
                  </div>
                  <label class="flex items-center mb-2">
                    <input type="radio" class="form-radio" name="role" />
                    <span class="text-sm text-gray-600 dark:text-gray-400 ml-3">CO-founder</span>
                  </label>
                  <label class="flex items-center mb-2">
                    <input type="radio" class="form-radio" name="role" />
                    <span class="text-sm text-gray-600 dark:text-gray-400 ml-3">Developer</span>
                  </label>
                  <label class="flex items-center mb-2">
                    <input type="radio" class="form-radio" name="role" />
                    <span class="text-sm text-gray-600 dark:text-gray-400 ml-3">Design / Marketing</span>
                  </label>
                  <label class="flex items-center mb-2">
                    <input type="radio" class="form-radio" name="role" />
                    <span class="text-sm text-gray-600 dark:text-gray-400 ml-3">Other</span>
                  </label>
                </div>
              </div> -->
              <div class="flex flex-wrap -mx-3 mt-6">
                <div class="w-full px-3">
                  <button @click="createNewPersona"
                    class="btn text-white bg-teal-500 hover:bg-teal-400 w-full flex items-center">
                    <span>Create Persona</span>
                    <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path class="fill-current"
                        d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                    </svg>
                  </button>
                </div>
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
import Header from './../partials/Header.vue'
import PageIllustration from './../partials/PageIllustration.vue'
import Footer from './../partials/Footer.vue'
import { useRouter, useRoute } from 'vue-router'


import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'
const { categories, getCategories, createAdminCategories } = useCategories()
const { createPersonas } = usePersonas()

let newPersona = ref({
  name: "",
  description: { en: "", fr: "" },
  basePrompt: "",

  //Arrays
  skills: [],
  categories: [],
  files: [],
  referenceBlocks: [],

  createdBy: "unknownUser",
})

const router = useRouter()
const route = useRoute()


onMounted(() => {
  getCategories();
})

function createNewPersona() {
  createPersonas(newPersona.value);
  router.push({name: 'home'})
}

</script>
