import { ref, onMounted, onUnmounted } from 'vue'
import axios from "axios";
import configuredAxios from "@/utils/axios.js"

import { v4 as uuidv4 } from 'uuid';


let files = ref(null)
let selectedFile = ref(null)

/*

file
{
    uuid
    uploadFile
    processedFileText text from the API
    highlights array
    highlightedText computed
    highlightedSegmentsArray computed
    persona
    status String
    facts Array

}

*/

const defaultFile = {
    uuid: null,
    name: null,
    description: { en: null, fr: null },
    context: null, //Additional file specific context string

    file: null,
    storageUrl: null,
    extractedFileText: null,// text from the API
    status: null,

    highlights: null,// array
    highlightedText: null,// computed
    highlightedSegmentsArray: null,// computed
    lastSelection: null, //Set by captureSelection

    knowledgeProfile: null, //Associated knowledge profile for additional context
    persona: null, //Persona processing the file
    facts: [], //Returned by the persona

};



// by convention, composable function names start with "use"
export function useFiles() {

    const stageFiles = (filesArray) => {
        const screenedFiles = [...filesArray].filter(
            file => ['text/plain', 'text/html', 'application/json', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
        );

        if (!files.value) files.value = {};

        screenedFiles.forEach((newFile) => {
            var createFile = { ...defaultFile };
            createFile.uuid = uuidv4();
            createFile.file = newFile;
            createFile.status = "unprocessed"
            createFile.name = newFile.name;
            files.value[createFile.uuid] = createFile;
        })
    };

    async function processFiles() {
        try {
            // Check the files
            if (!files.value || files.value.length === 0) {
                console.log('No files selected!');
                return;
            }

            // Create a FormData
            const formData = new FormData();
            var uuidArray = [];
            Object.values(files.value).forEach((file) => {
                if (file.status == 'unprocessed') {
                    formData.append('files', file.file);
                    uuidArray.push(file.uuid)
                }
            });

            formData.append('uuids', JSON.stringify(uuidArray));

            // Get the results
            const response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/files', formData);

            // Check response structure
            if (response && response.data && Array.isArray(response.data.payload)) {
                response.data.payload.forEach((responseFile) => {
                    if (responseFile.uuid && files.value[responseFile.uuid]) {
                        files.value[responseFile.uuid].storageUrl = responseFile.storageUrl;
                        files.value[responseFile.uuid].extractedFileText = responseFile.extractedFileText;
                        files.value[responseFile.uuid].status = 'extracted';
                    }
                });
            }
        } catch (error) {
            console.log("Error", error);
            // Optionally re-throw the error if you want the caller to handle it
            // throw error;
        }
    }

    //Process the files content
    const captureSelection = () => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        const start = range.startOffset;
        const end = range.endOffset;
        return { start, end };
    };

    //Create a highlight
    const highlight = (highlights, lastSelection, type) => {
        if (!lastSelection) return;

        const newHighlight = { ...lastSelection, type };

        for (let i = 0; i < highlights.length; i++) {
            const highlight = highlights[i];

            // Completely contained
            if (newHighlight.start <= highlight.start && newHighlight.end >= highlight.end) {
                highlights.splice(i, 1);
                i--;
                continue;
            }

            // Partial overlap
            if (newHighlight.start < highlight.end && newHighlight.end > highlight.start) {
                if (highlight.type !== newHighlight.type) {
                    if (newHighlight.start > highlight.start) {
                        highlight.end = newHighlight.start;
                    } else if (newHighlight.end < highlight.end) {
                        highlight.start = newHighlight.end;
                    }
                } else {
                    highlight.start = Math.min(newHighlight.start, highlight.start);
                    highlight.end = Math.max(newHighlight.end, highlight.end);
                    return;
                }
            }
        }

        // Add the new highlight
        highlights.push(newHighlight);

        // Reset the last selection
        lastSelection = null;

        return highlights;
    };


    // expose managed state as return value
    return {
        files,
        selectedFile, //May not be used
        stageFiles,
        captureSelection,
        highlight,
        processFiles,

    }
}