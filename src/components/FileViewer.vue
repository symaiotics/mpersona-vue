<template>
    <div class="flex h-auto bg-gray-800 text-white">
        <!-- Left Column for File List -->
        <div class="w-1/3 p-4 overflow-y-auto border-r border-gray-600">
            <div v-for="(file, key) in files" :key="key" class="py-2 px-4 my-2 hover:bg-gray-700 cursor-pointer"
                @click="selectFile(file)" @mouseover="hoverFile(file)">
                {{ file.name }} ({{ file.status }})
            </div>
        </div>

        <!-- Right Column for File Details Form -->
        <div class="w-2/3 p-4" v-if="selectedFile">
            <form @submit.prevent>
                <div class="mb-4">
                    <label for="name" class="block mb-2">Name</label>
                    <input id="name" v-model="selectedFile.name" class="w-full p-2 bg-gray-700 rounded" type="text"
                        placeholder="Enter name" />
                </div>

                <div class="mb-4">
                    <label for="description-en" class="block mb-2">Description (EN)</label>
                    <input id="description-en" v-model="selectedFile.description.en" class="w-full p-2 bg-gray-700 rounded"
                        type="text" placeholder="Enter description in English" />
                </div>

                <div class="mb-4">
                    <label for="description-fr" class="block mb-2">Description (FR)</label>
                    <input id="description-fr" v-model="selectedFile.description.fr" class="w-full p-2 bg-gray-700 rounded"
                        type="text" placeholder="Enter description in French" />
                </div>

                <div class="mb-4">
                    <label for="context" class="block mb-2">Context</label>
                    <textarea id="context" v-model="selectedFile.context" class="w-full p-2 bg-gray-700 rounded"
                        placeholder="Enter context"></textarea>
                </div>

                <HighlightFileContents :originalText="selectedFile.extractedFileText" />

                <button type="submit" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">Save</button>
            </form>
        </div>
    </div>
</template>
  
<script setup>
import { ref, toRefs, reactive } from 'vue'

import HighlightFileContents from '@/components/HighlightFileContents.vue';

import { useFiles } from '@/composables/useFiles.js'
const { files, selectedFile, processFiles } = useFiles()


const hoverFile = (file) => {
    // Implement logic for mouseover if needed
}

const selectFile = (file) => {
    selectedFile.value = file
}

const submitForm = () => {
    // Implement form submission logic
    console.log('Form Submitted:', selectedFileDetails)
}
</script>
  
<style>
/* You can add additional styles here if needed */
</style>