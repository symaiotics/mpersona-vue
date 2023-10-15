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

      <section class="relative">

        <div class="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32">


            <!-- <DisplayPersona alignment="center" :persona="selectedPersona" /> -->

            <HeroChat/>
            <Socket alignment="center" :persona="selectedPersona" :userPrompt = "chatPrompt || 'greet me'" :trigger = "triggerGenerate">

            </Socket>

            
            <div class="max-w-2xl mx-auto md:px-4">
                <form @submit.prevent = "trigger" class="relative flex items-center mt-8" data-aos="fade-down" data-aos-delay="300">
                  <input v-model = "chatPrompt" type="search" class="form-input w-full pl-12" placeholder="Ask me about …"
                    aria-label="Search anything" />
                  <button type="submit" class="absolute inset-0 right-auto" aria-label="Search">
                    <svg class="w-4 h-4 shrink-0 ml-4 mr-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path class="fill-current text-gray-400"
                        d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm8.707 12.293a.999.999 0 11-1.414 1.414L11.9 13.314a8.019 8.019 0 001.414-1.414l2.393 2.393z" />
                    </svg>
                  </button>
                </form>
              </div>

            <!-- <HelpList /> -->
            <ChatList v-if = "selectedPersona?.knowledgeProfiles?.length" :facts= "factSearchResults" @promptQuestion = "promptQuestion" />
            <!-- <RelatedLinks /> -->

          </div>
        </div>
      </section>

    </main>

    <!-- Site footer -->
    <Footer />

  </div>
</template>

<script setup>

import { ref, onMounted, nextTick } from 'vue';


import Header from '@/partials/Header.vue'
import PageIllustration from '@/partials/PageIllustration.vue'
import HeroChat from '@/partials/HeroChat.vue'
import HelpList from '@/partials/HelpList.vue'
import ChatList from '@/partials/ChatList.vue'
import RelatedLinks from '@/partials/RelatedLinks.vue'
import Footer from '@/partials/Footer.vue'

import DisplayPersona from '@/components/DisplayPersona.vue'
import Socket from '@/components/Socket.vue'

//Composables
import { usePersonas } from '@/composables/usePersonas.js'
import { useFacts } from '@/composables/useFacts.js'
const { personas, selectedPersona, newPersona, getPersonas, resetPersona } = usePersonas()
const { searchFacts,   factSearchResults } = useFacts()

let props = defineProps({ personaId: { type: String, default: null } })
let triggerGenerate = ref(false);
let chatPrompt = ref("");

onMounted(async () => {
  await getPersonas();
  if (props.personaId) selectedPersona.value = personas.value.find((persona) => { return persona.uuid == props.personaId })
  trigger();
})

function trigger()
{
  triggerGenerate.value = !triggerGenerate.value;
  let knowledgeProfileUuids = [];
  if(selectedPersona?.value?.knowledgeProfiles?.length) selectedPersona.value.knowledgeProfiles.map((kp)=>{return kp.uuid}) || [];
  if(chatPrompt?.value?.length) searchFacts(chatPrompt.value, knowledgeProfileUuids)
}

function promptQuestion(question)
{
  chatPrompt.value = question;
  trigger();

}
</script>
