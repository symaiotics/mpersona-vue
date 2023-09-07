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
        <div class="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">

            <!-- Page header -->
            <div class="max-w-3xl mx-auto text-center pb-3 md:pb-4">
              <h1 class="h1 font-red-hat-display mb-4">Create a Knowledge Profile</h1>
              <p class="text-xl text-gray-600 dark:text-gray-400">A knowledge profile integrates up to 1,000 files of
                context for your Persona to reference, expanding your world of possibility.</p>
              <br />
              <div v-if="!token">
                <p>
                  Note: You are <b>not</b> logged in, so any knowledge profiles you create will be visible and usable by
                  the public.
                </p>
                <p>If you would like to keep your knowledge profile private, please <router-link to="/join"> make a free
                    account.</router-link></p>
              </div>

              <div v-if="token">
                <p>Since you are logged in, your knowledge profile will only be visible to you and anyone you share it
                  with.</p>
              </div>

            </div>

            <!-- Contact form -->
            <!-- <div class="max-w-xl mx-auto"> -->
            <div class="flex flex-wrap -mx-3 mb-1">

              <div class="w-full  px-3 mb-4 md:mb-1">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="first-name">
                  Profile Name
                  <span class="text-red-600">*</span>
                </label>
                <input v-model="newKnowledgeProfile.name" id="first-name" type="text" class="form-input w-full"
                  placeholder="Enter the name of the knowledge Profile" required />
              </div>

              <div class="w-full  px-3 mb-4 md:mb-1">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="persona-description">
                  Description
                  <span class="text-sm text-gray-500">Optional</span>
                </label>
                <input v-model="newKnowledgeProfile.description.en" id="persona-description" type="text"
                  class="form-input w-full" placeholder="Enter a brief description" required />
              </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-5">
              <div class="w-full px-3">
                <div class="flex justify-between items-center mb-1">
                  <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium" for="message">
                    Knowledge Sources
                  </label>
                  <span class="text-sm text-grey-500">Optional</span>
                </div>
                <textarea v-model="newKnowledgeProfile.sources" id="message" rows="8" class="form-textarea w-full"
                  placeholder="Define the knowledge sources. Future personas will be able to fetch this autonomously and monitor for changes."></textarea>
                <p>Enter the URLs where you found this information for future reference</p>
              </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-5">
              <div class="w-full px-3">
                <div class="flex justify-between items-center mb-1">
                  <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium" for="message">
                    Knowledge Context
                  </label>
                  <span class="text-sm text-red-500">* Required</span>
                </div>
                <textarea v-model="newKnowledgeProfile.context" id="message" rows="8" class="form-textarea w-full"
                  placeholder="Define the knowledge context" required></textarea>
                <p> What is the context of this knowledge? For the best outcomes, please include sources of knowledge from
                  a common or related source or theme.</p>
              </div>
            </div>


            <div class="flex flex-wrap -mx-3 mt-6">
              <div class="w-full px-3">
                <DragAndDropFiles />
                <p> Drag and drop your files.</p>

              </div>
            </div>


            <div class="flex flex-wrap -mx-3 mt-6">
              <div class="w-full px-3">
                <button @click="processKnowledgeProfileFiles"
                  class="btn text-white bg-blue-500 hover:bg-blue-400 w-full flex items-center mb-3">
                  <span>Process Files</span>
                  <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path class="fill-current"
                      d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                  </svg>
                </button>
              </div>
            </div>


            <div class="flex flex-wrap -mx-3 mt-6">
              <div class="w-full px-3">
                <button @click="createNewKnowledgeProfile"
                  class="btn text-white bg-teal-500 hover:bg-teal-400 w-full flex items-center mb-3">
                  <span>Create Knowledge Profile</span>
                  <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path class="fill-current"
                      d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                  </svg>
                </button>
              </div>
            </div>

<!-- <StickyBox/> -->
            <div v-if="newKnowledgeProfile?.processedFiles?.length" class="flex flex-wrap -mx-3 mt-6">
              <div v-for="(kp, index) in newKnowledgeProfile.processedFiles" :key="'processedFile' + index" class="w-full px-3">
                <!-- {{ kp.content }}  -->
                <HighlightFileContents :originalText="kp.content" />
                <!-- <HighlightFileContents />
                <HighlightFileContents />

                <FloatingHighlightBar  @command-clicked="handleCommand"/> -->

              </div>
            </div>

            <!-- </div> -->

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
import { useRouter } from 'vue-router'
import DragAndDropFiles from '@/components/DragAndDropFiles.vue';
import HighlightFileContents from '@/components/HighlightFileContents.vue';
import FloatingHighlightBar from '@/components/FloatingHighlightBar.vue';
import StickyBox from '@/components/StickyBox.vue';
import { useTokens } from '@/composables/useTokens.js'
const { token, tokenDecoded } = useTokens()


import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js'
const { newKnowledgeProfile, resetKnowledgeProfile, getKnowledgeProfiles, processKnowledgeProfileFiles } = useKnowledgeProfiles()

// let newKnowledgeProfile = ref({
//   name: "",
//   description: { en: "", fr: "" },
//   createdBy: 'public',
// })

const router = useRouter()

onMounted(() => {
  // getCategories();
})

function createNewKnowledgeProfile() {
  createKnowledgeProfiles(newKnowledgeProfile.value);
  // router.push({ name: 'home' })
}

function handleCommand(command) {
  console.log("Command", command)
}

</script>
