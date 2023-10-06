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
            <div class="max-w-3xl mx-auto text-center pb-6 md:pb-6">
              <h1 class="h1 font-red-hat-display mb-4">Assist</h1>
              <p class="text-xl text-gray-600 dark:text-gray-400">You've now signed in with Google.</p>
              <p class="text-xl text-gray-600 dark:text-gray-400">You can deploy Personas to respond to your <span
                  v-if="googleTokensDecoded"><b>{{
                    googleTokensDecoded.email }}</b></span> emails.</p>

              <!-- <p>{{ googleCode }}</p>
              <p>{{ googleTokens }}</p> -->
              <!-- <p>{{ googleTokensDecoded.email }}</p> -->
              <!-- <p>{{ props.link }}</p> -->
            </div>



            <Tabs :tabs="tabs" v-model="activeTab">
              <template v-slot:tab-0>

                <div class="flex flex-col  ">
                  <button @click="getEmails"
                    class=" whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 p-3 rounded">
                    Check Inbox
                  </button>
                </div>

                <!-- 
                <template v-for="(socket, index) in sockets" :key="'stageSocket'+index">
                  <Socket :trigger="triggerGeneration" :stageIndex="0" stageUuid="0" :socketIndex="index"
                    :userPrompt="emailPrompt" :persona="socket.persona" @close="removeSocket" />
                </template> -->

                <EmailsTable @changeTab="changeActiveTab" @respondToEmail="respondToEmail" />
              </template>
              <template v-slot:tab-1>

                <div class="flex flex-row">
                  <div class="flex flex-col w-full p-2 m-1 ">
                    <VueMultiselect v-if="personas" v-model="selectedPersona" placeholder="Select a persona" label="name"
                      track-by="name" :options="personas" :option-height="104" :custom-label="customLabel"
                      :show-labels="false" />
                  </div>
                  <div class="flex flex-col  ">
                    <button @click="add"
                      class=" whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 p-3 rounded">
                      Add
                    </button>
                  </div>
                </div>

        

                <template v-if="selectedEmail?.payload?.parts?.length">

                  <div class="border rounded-sm p-3" v-html="emailParts"></div>
                  <!-- {{ emailPrompt }} -->
                </template>

                <div class="flex flex-col mb-3  ">
                  <button @click="triggerGeneration = !triggerGeneration"
                    class=" whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 p-3 rounded">
                    Reply
                  </button>
                </div>


                <template v-for="(socket, index) in sockets" :key="'stageSocket'+index">
                  <Socket :trigger="triggerGeneration" :stageIndex="0" stageUuid="0" :socketIndex="index"
                    :sessionId="sockets.sessionId" :userPrompt="emailPrompt" :persona="socket.persona"
                    @close="removeSocket" />
                </template>

                <button
                  class=" whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 p-3 rounded">
                  Send
                </button>


              </template>
            </Tabs>

            <!-- Contact form -->

            <!-- <div v-if="linkInvalid" class=" flex flex-wrap mx-auto -mx-3 ">
              <div class="w-full  px-3 mb-4  text-center ">
                Sorry, this link does not appear to be valid. Request a new link from the Persona owner.
              </div>
            </div> -->


          </div>
        </div>
      </section>

    </main>

    <!-- Site footer -->
    <Footer />

  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import VueMultiselect from 'vue-multiselect'

//Components
import Header from './../partials/Header.vue'
import PageIllustration from './../partials/PageIllustration.vue'
import Footer from './../partials/Footer.vue'
import EmailsTable from '@/components/EmailsTable.vue'
import Tabs from '@/components/Tabs.vue';
import Socket from '@/components/Socket.vue'

//Composables
import { notify } from "notiwind"
import { v4 as uuidv4 } from 'uuid';

import { useGoogle } from '@/composables/useGoogle.js'
import { usePersonas } from '@/composables/usePersonas.js'
const { googleCode, googleTokens, googleTokensDecoded, upgradeGoogleCode, getEmails, selectedEmail, emails } = useGoogle()
const { personas, selectedPersona, getPersonas } = usePersonas()

let props = defineProps({ code: { type: String, default: null } })

let activeTab = ref(0)
const tabs = ref([
  { label: 'Emails' },
  { label: 'Interact' },
  // { label: '' },
]);
let triggerGeneration = ref(false);
let localModel = ref(null)
let stageOptions = ref(null);

let sockets = ref([])
let emailPrompt = computed(() => {
  return stripHtml(emailParts.value) + "\n\n Today's date is " + new Date();

})

let emailParts = computed(() => {
  var body = "";
  if (selectedEmail?.value?.payload?.parts?.length) {
    selectedEmail.value.payload.parts.forEach((part, index) => {
      if (part.mimeType == 'text/html') body += part.body.data;
    })
  }
  return body;
})

function removeSocket(index) {
  console.log(index)
  sockets.value.splice(index, 1)
}
const stripHtml = (html) => {
  let div = document.createElement('div');
  div.innerHTML = html;

  // Remove all <script> tags
  let scripts = div.getElementsByTagName('script');
  for (let i = scripts.length - 1; i >= 0; i--) {
    scripts[i].parentNode.removeChild(scripts[i]);
  }

  // Remove all <style> tags
  let styles = div.getElementsByTagName('style');
  for (let i = styles.length - 1; i >= 0; i--) {
    styles[i].parentNode.removeChild(styles[i]);
  }

  return div.textContent || div.innerText || "";
};




const customLabel = (option) => option ? option.name : '';

onMounted(async () => {

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code && !googleTokens.value) {
    googleCode.value = code;

    upgradeGoogleCode().then((response) => {
      console.log("Google Tokens", googleTokens.value)
      getEmails();
    }).catch((error => {
      console.log("Error upgrading token")
    }));
    // console.log(code);

  }

  getPersonas();


})

function add() {
  if (selectedPersona.value) sockets.value.push({ sessionId: uuidv4(), persona: selectedPersona.value })
}

function changeActiveTab(val) { activeTab.value = val; }
function respondToEmail(val) { activeTab.value = val; }
</script>
