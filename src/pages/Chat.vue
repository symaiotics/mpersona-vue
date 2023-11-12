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

            <HeroChat />
            <!-- {{ messageHistory }} -->
            <Socket alignment="center" :model = "adminModels[0]" :sessionId="sessionId" :persona="selectedPersona" :userPrompt="chatPrompt"
              :messageHistory="messageHistory" :trigger="triggerGenerate" @messageComplete="messageComplete" @messagePartial="messagePartial">
<!-- {{ messageHistory }} -->
              <ChatWindow :messages="messageHistory" />

            </Socket>
            <!-- <ChatWindow :messages="messageHistory"/> -->

            <div class="max-w-2xl mx-auto md:px-4">
              <form @submit.prevent="trigger" class="relative flex items-center mt-8" data-aos="fade-down"
                data-aos-delay="300">
                <textarea ref="textarea" @keyup.enter="event => { if (!event.shiftKey) trigger() }" v-model="chatPrompt"
                  @input="adjustHeight" class="form-input w-full pl-12" placeholder="Ask me about …"
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
            <ChatList v-if="selectedPersona?.knowledgeProfiles?.length" :facts="factSearchResults"
              @promptQuestion="promptQuestion" />
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

import { ref, onMounted, nextTick, watch } from 'vue';

import { v4 as uuidv4 } from 'uuid';

import Header from '@/partials/Header.vue'
import PageIllustration from '@/partials/PageIllustration.vue'
import HeroChat from '@/partials/HeroChat.vue'
import HelpList from '@/partials/HelpList.vue'
import ChatList from '@/partials/ChatList.vue'
import RelatedLinks from '@/partials/RelatedLinks.vue'
import Footer from '@/partials/Footer.vue'

import DisplayPersona from '@/components/DisplayPersona.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import Socket from '@/components/Socket.vue'

//Composables
import { useModels } from '@/composables/useModels.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useFacts } from '@/composables/useFacts.js'
const { adminModels } = useModels()
const { personas, selectedPersona, newPersona, getPersonas, resetPersona } = usePersonas()
const { searchFacts, factSearchResults } = useFacts()

let props = defineProps({ personaId: { type: String, default: null } })
let triggerGenerate = ref(false);
let chatPrompt = ref("");
// let initialPrompt = ref('Say hello.');
let sessionId = ref(uuidv4())
let messageHistory = ref([]);
const textarea = ref(null);

onMounted(async () => {
  if (props.personaId) {
    await getPersonas();
    selectedPersona.value = personas.value.find((persona) => { return persona.uuid == props.personaId })
    if (selectedPersona?.value?.basePrompt?.length) {
      messageHistory.value.push({ role: "system", content: selectedPersona.value.basePrompt })
    }
  }
})

function trigger() {
  //Save the history
  messageHistory.value.push({ role: "user", content: JSON.parse(JSON.stringify(chatPrompt.value)) })

  triggerGenerate.value = !triggerGenerate.value;

  //Get the facts
  let knowledgeProfileUuids = [];
  if (selectedPersona?.value?.knowledgeProfiles?.length) knowledgeProfileUuids = selectedPersona.value.knowledgeProfiles.map((kp) => { return kp.uuid }) || [];
  if (chatPrompt?.value?.length) searchFacts(chatPrompt.value, knowledgeProfileUuids)
  nextTick(()=>{
    chatPrompt.value = "";
  })


}

// function messageComplete(val) {
//   //On message completion add it
//   messageHistory.value.push({ role: "system", content: val.message })
//   messageHistory.value = cleanseMessageHistory(messageHistory.value)
//   // chatPrompt.value = "";
// }



function messagePartial(val) {
  if (messageHistory?.value?.length) {
    if (messageHistory.value[messageHistory.value.length - 1].role == 'user') {
      messageHistory.value.push({ role: "system", content: val.message })
    }
    if (messageHistory.value[messageHistory.value.length - 1].role == 'system' && val.message.length) {
      messageHistory.value[messageHistory.value.length - 1].content = val.message;
    }
  }
  //  scrollToBottom();
}


function messageComplete(val) {
  console.log("MC", val)
  if (messageHistory?.value?.length) {
    if (messageHistory.value[messageHistory.value.length - 1].role == 'system') {
      messageHistory.value[messageHistory.value.length - 1].content = val.message;
    }
  }
}


function cleanseMessageHistory(messageHistory) {
  // Define a function to check if the messageHistory exceeds the length limit.
  const exceedsLimit = () => JSON.stringify(messageHistory).length > 5000;

  // If the length is more than 8 items, handle normally
  if (messageHistory.length > 8) {
    // Truncate the 5 items before the last 2
    for (let i = messageHistory.length - 7; i <= messageHistory.length - 3; i++) {
      if (messageHistory[i].content.length > 500) {
        messageHistory[i].content = messageHistory[i].content.substring(0, 500);
      }
    }

    // If still exceeds limit after truncation, remove middle items
    if (exceedsLimit()) {
      return [
        messageHistory[0],
        ...messageHistory.slice(messageHistory.length - 7)
      ];
    }

    return messageHistory;
  } else {
    // If 8 or fewer items, truncate all but the 1st and last 2 items
    for (let i = 1; i < messageHistory.length - 2; i++) {
      if (messageHistory[i].content.length > 500) {
        messageHistory[i].content = messageHistory[i].content.substring(0, 500);
      }
    }

    // No need to remove any items since there are 8 or fewer
    return messageHistory;
  }
}


const adjustHeight = () => {
  nextTick(() => {
    textarea.value.style.height = 'auto';
    textarea.value.style.height = (textarea.value.scrollHeight + 10) + 'px';
  });
};

watch(chatPrompt, () => {
  adjustHeight();
});



function promptQuestion(question) {
  chatPrompt.value = question;
  trigger();

}
</script>
