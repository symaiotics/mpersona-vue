<template>
    <div class="flex dark:bg-gray-800">
        <!-- Left Column for displaying personas -->
        <div class="w-1/2  p-4 dark:border-gray-700">
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Name</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Description</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Image</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(persona, index) in personas" :key="index" @click="selectPersona(index)"
                        class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ persona.name }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ persona.description.en }}</td>
                        <td class="border dark:border-gray-700 p-3">
                            <img :src="persona.url || defaultImage" alt="Persona Image" class="w-16 h-16" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Right Column for displaying selected persona details in a form -->
        <div class="w-1/2 p-4 dark:bg-gray-900" v-if="selectedPersona">
            <form @submit.prevent="updatePersona">
                <div class="mb-4">
                    <label for="name" class="block mb-2 dark:text-gray-300">Name</label>
                    <input type="text" id="name" v-model="selectedPersona.name"
                        class="w-full p-2 border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" />
                </div>
                <div class="mb-4">
                    <label for="descriptionEn" class="block mb-2 dark:text-gray-300">Description (EN)</label>
                    <input type="text" id="descriptionEn" v-model="selectedPersona.description.en"
                        class="w-full p-2 border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" />
                </div>
                <div class="mb-4">
                    <label for="descriptionFr" class="block mb-2 dark:text-gray-300">Description (FR)</label>
                    <input type="text" id="descriptionFr" v-model="selectedPersona.description.fr"
                        class="w-full p-2 border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" />
                </div>
                <div class="mb-4">
                    <label for="url" class="block mb-2 dark:text-gray-300">Image URL</label>
                    <input type="text" id="url" v-model="selectedPersona.url"
                        class="w-full p-2 border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" />
                </div>

                <div class="mb-4"  v-if = "selectedPersona.isOwner || selectedPersona.isEditor">
                    <label for="url" class="block mb-2 dark:text-gray-300">Viewer Link</label>
                    <p v-if="selectedPersona.viewerLink">{{ selectedPersona.viewerLink }}</p>
                    <div v-else>
                        There is no viewer link.
                    </div>
                    <div class="flex space-x-4">
                        <button @click="createViewerLink" class="px-4 py-2 bg-blue-500 text-white dark:bg-blue-700">Create
                            Viewer Link</button>
                        <button v-if="selectedPersona.viewerLink" @click="copy(selectedPersona.viewerLink)"
                            class="px-4 py-2 bg-gray-500 text-white dark:bg-gray-700">Copy Link</button>
                    </div>

                </div>

                <div class="mb-4"  v-if = "selectedPersona.isOwner || selectedPersona.isEditor">
                    <label for="url" class="block mb-2 dark:text-gray-300">Editor Link</label>
                    <p v-if="selectedPersona.editorLink">{{ selectedPersona.editorLink }}</p>
                    <div v-else>
                        There is no viewer link.
                    </div>
                    <div class="flex space-x-4">
                        <button @click="createEditorLink" class="px-4 py-2 bg-blue-500 text-white dark:bg-blue-700">Create
                            Editor Link</button>
                        <button v-if="selectedPersona.editorLink" @click="copy(selectedPersona.editorLink)"
                            class="px-4 py-2 bg-gray-500 text-white dark:bg-gray-700">Copy Link</button>
                    </div>
                </div>

                <div class="mb-4">
                    <label for="url" class="block mb-2 dark:text-gray-300">Persona Instructions</label>
                    <textarea v-model="selectedPersona.basePrompt" id="message" rows="8" class="form-textarea w-full"
                        placeholder="Define the persona instructions" required></textarea>
                </div>

                <div class="flex space-x-4">
                    <button v-if = "selectedPersona.isOwner || selectedPersona.isEditor" @click="updatePersona" class="px-4 py-2 bg-green-500 text-white dark:bg-green-700">Update
                        Persona</button>
                    <button v-if = "selectedPersona.isOwner"  @click="deletePersona" class="px-4 py-2 bg-yellow-500 text-white dark:bg-yellow-700">Delete
                        Persona</button>
                </div>
            </form>
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';

import { generate, count } from "random-words";

import defaultImage from "../images/persona1.png"
import { usePersonas } from '@/composables/usePersonas.js';
const { selectedPersona, personas, updatePersonas } = usePersonas();

// let props = defineProps({ personas: { type: Array, default: [] } })
// let emit = defineEmits(['createViewerLink', 'createEditorLink', 'updatePersona', 'deletePersona']);

const selectPersona = (index) => {
    selectedPersona.value = { ...personas.value[index] };
};


function createViewerLink(persona) {
    var words = generate({ exactly: 2, minLength: 5, maxLength: 20 })
    selectedPersona.value.viewerLink = words.join('-') + "_" + selectedPersona.value.uuid
    // if(persona.uuid) personaCreateLink('viewer', persona)  
}

function createEditorLink(persona) {
    var words = generate({ exactly: 2, minLength: 5, maxLength: 20 })
    selectedPersona.value.editorLink = words.join('-') + "_" + selectedPersona.value.uuid
}

function updatePersona() {
updatePersonas([selectedPersona.value])
}

function deletePersona(persona) {

}


// const emitUpdate = (type) => {
//     if (selectedPersona.value) emit(type, selectedPersona.value)
// };

</script>
  
