import { ref, onMounted, onUnmounted } from 'vue'
// import axios from "axios";
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

import { useTokens } from '@/composables/useTokens.js'
const { tokenDecoded } = useTokens();

let knowledgeProfiles = ref(null)
let selectedKnowledgeProfile = ref(null) //the actively selected persona

const defaultKnowledgeProfile = {
    name: null,
    description: { en: null, fr: null },
    sources: null,
    context: null,

    sourceStructure: null,
    sourceAnalysisStatus: 'notStarted',
    targetStructure: null,
    targetAnalysisStatus: 'notStarted',

    files: [],
    processedFiles: [],
    createdBy: 'public',
};

const newKnowledgeProfile = ref({ ...defaultKnowledgeProfile });

// by convention, composable function names start with "use"
export function useKnowledgeProfiles() {

    const resetKnowledgeProfile = () => {
        Object.assign(newKnowledgeProfile.value, defaultKnowledgeProfile);
    };

    async function getKnowledgeProfiles() {
        try {
            var response = await configuredAxios.get(import.meta.env.VITE_API_URL + '/knowledgeProfiles');
            knowledgeProfiles.value = response.data.payload;
            //TODO enhance to receive the code as well
            console.log("Loaded Knowledge Profiles", knowledgeProfiles.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createKnowledgeProfiles() {
        try {
            var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/knowledgeProfiles');
            // knowledgeProfiles.value = response.data.payload;
            //TODO enhance to receive the code as well
            console.log("Saved Knowledge Profiles", response)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function processKnowledgeProfileFiles() {
        try {

            //Check the files
            if (newKnowledgeProfile?.value?.files?.length === 0) {
                console.log('No files selected!');
                return;
            }

            //Create a FormData
            const formData = new FormData();
            newKnowledgeProfile.value.files.forEach((file) => {
                formData.append('files', file);
            });

            //Get the results
            var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/files', formData);
            newKnowledgeProfile.value.processedFiles = response.data.payload;
            console.log("Saved Knowledge Profile Files", response.data.payload)
        }
        catch (error) {
            console.log("Error", error)
        }
    }



    // async function getSkills() {
    //     try {
    //         var response = await configuredAxios.get(import.meta.env.VITE_API_URL + '/personas/skills');
    //         skills.value = response.data.payload;

    //         //TODO enhance to receive the code as well
    //         console.log("Loaded Skills", skills.value)
    //     }
    //     catch (error) {
    //         console.log("Error", error)
    //     }
    // }


    // async function getUsedCategories() {
    //     try {
    //         var response = await configuredAxios.get(import.meta.env.VITE_API_URL + '/personas/categories');
    //         usedCategories.value = response.data.payload;

    //         //TODO enhance to receive the code as well
    //         console.log("Loaded Used Categories", usedCategories.value)
    //     }
    //     catch (error) {
    //         console.log("Error", error)
    //     }
    // }

    // async function createPersonas(newPersonas) {
    //     try {
    //         if (!Array.isArray(newPersonas)) newPersonas = [newPersonas]
    //         var params = { personas: newPersonas }
    //         var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/personas', params);
    //         console.log(response.data.payload)
    //         // currentPersona.value = response;    
    //         notify({ group: "success", title: "Success", text: "Persona(s) created successfully" }, 4000) // 4s
    //         getPersonas();
    //     }
    //     catch (error) {
    //         console.log("Error", error)
    //         notify({ group: "failure", title: "Error", text: "Error creating persona(s). Try again" }, 4000) // 4s
    //     }
    // }

    // async function createNewPersonaAvatar(description) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             var params = { avatarPrompt: "An attractive digital avatar, Pixar style 3D render of a friendly person smiling, inside, 4k, high resolution, trending in artstation, for a " + description + " " }
    //             var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/personas/avatar', params);
    //             resolve(import.meta.env.VITE_STORAGE_URL + "/images/" + response.data.payload)
    //             getPersonas();
    //         }

    //         catch (error) {
    //             console.log("Error", error)
    //             reject(error)
    //         }
    //     })
    // }

    // async function updatePersonas(updatePersonas) {
    //     try {
    //         if (!Array.isArray(updatePersonas)) updatePersonas = [updatePersonas]
    //         var params = { personas: updatePersonas }
    //         var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/personas/update', params);
    //         console.log(response.data.payload)
    //         // currentPersona.value = response;    
    //         notify({ group: "success", title: "Success", text: "Persona(s) updated successfully" }, 4000) // 4s
    //         getPersonas();
    //     }
    //     catch (error) {
    //         console.log("Error", error)
    //         notify({ group: "failure", title: "Error", text: "Error updating persona(s). Try again" }, 4000) // 4s

    //     }
    // }



    // expose managed state as return value
    return {

        newKnowledgeProfile,

        resetKnowledgeProfile,
        getKnowledgeProfiles,
        createKnowledgeProfiles,
        processKnowledgeProfileFiles


        // personas,
        // selectedPersona,
        // usedCategories,
        // skills,

        // getPersonas,
        // getSkills,
        // getUsedCategories,
        // createPersonas,
        // updatePersonas,

        // createNewPersonaAvatar,

    }
}