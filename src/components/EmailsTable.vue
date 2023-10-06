<template>
    <div class="flex flex-col-reverse md:flex-row dark:bg-gray-800">
        <div class="w-full  p-4 dark:border-gray-700 md:order-2">
            <table class="w-full" v-if="emails">
                <thead>
                    <tr>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Sender</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Subject</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Date</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Reply</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(email, index) in emails" :key="index">
                        <tr class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700" @click="selectEmail(index)">
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ emailPayload(email, 'From') }}
                            </td>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ emailPayload(email, 'Subject')
                            }}</td>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ emailPayload(email, 'Date') }}
                            </td>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-3">

                                <button @click="respondToEmail"
                                    class=" bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-150">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </button>

                            </td>



                        </tr>
                        <tr class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700" @click="selectEmail(index)">
                            <td colspan="4" class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ email.snippet }}
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>


    </div>
</template>
  
<script setup>
import { ref, nextTick } from 'vue';

import { useGoogle } from '@/composables/useGoogle.js';
const { emails, selectedEmail } = useGoogle();
import ButtonGenerate from '@/components/ButtonGenerate.vue';

let emit = defineEmits(['changeTab', 'respondToEmail']);

const selectEmail = (index) => {
    selectedEmail.value = { ...emails.value[index] };
    console.log("SelectedEmail", selectedEmail.value)
    emit('changeTab', 1)
};

const respondToEmail = (index) => {
    selectedEmail.value = { ...emails.value[index] };
    console.log("Respond To EMail", selectedEmail.value)
    nextTick(()=>{
        emit('respondToEmail', index)
    })
};


function emailPayload(email, attr) {
    var val = email.payload.headers.find((e) => { return e.name == attr })
    return val?.value || ""
}

</script>
  
