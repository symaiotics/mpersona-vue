<template>
    <div>
        <div @click="openFileDialog" @dragover.prevent="dragOverHandler" @dragleave="dragLeaveHandler"
            @drop.prevent="dropHandler"
            :class="isDraggingOver ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'"
            class="border p-6 rounded-md transition-colors duration-300 cursor-pointer dark:hover:bg-slate-700 hover:bg-gray-200">
            <input type="file" ref="fileInput" @change="handleFilesChange" multiple hidden accept=".docx,.json,.txt,.yaml">
            <p class="text-center text-gray-500 dark:text-gray-200">
                {{ L_("Drag and drop or click to select your .docx, .json, or .txt files here.") }}
            </p>
        </div>
    </div>
</template>
  
<script setup>
import { ref, defineEmits } from 'vue';
import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import { useLexicon } from '@/composables/useLexicon.js';
const { L_ } = useLexicon();

import { v4 as uuidv4 } from 'uuid';

const fileInput = ref(null);
const isDraggingOver = ref(false);
const emit = defineEmits(['documentsChanged', 'processingStarted', 'processingCompleted']);

const openFileDialog = () => {
    fileInput.value.click();
};

const dragOverHandler = () => {
    isDraggingOver.value = true;
};

const dragLeaveHandler = () => {
    isDraggingOver.value = false;
};

const dropHandler = (event) => {
    isDraggingOver.value = false;
    handleFilesChange(event);
};

const handleFilesChange = async (event) => {
    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    const documentFiles = Array.from(files);
    const newDocs = [];

    for (const file of documentFiles) {
        let html = null;
        let text = null;

        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            html = result.value;
            text = stripHtml(html);
        } else {
            text = await file.text();
        }

        newDocs.push({
            uuid: uuidv4(),
            name: { en: null, fr: null },
            description: { en: null, fr: null },
            keywords: [],
            categoryScores: [],
            original: {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified,
            },
            imgSrc: null,
            htmlContent: html,
            htmlLength: html ? html.length : null,
            textContent: text,
            textLength: text ? text.length : null,
            storageUrl: null,
            imgStorageUrl: null,
            tagUuids: [],
        });
    }

    emit('documentsChanged', newDocs)
    // Handle the newDocs array as needed

    //Reset the file selection
    if (event.target) {
        event.target.value = '';
    }
};

function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

</script>

 