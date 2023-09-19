import { ref, onMounted, onUnmounted } from 'vue'
// import axios from "axios";
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

import { useTokens } from '@/composables/useTokens.js'
const { tokenDecoded } = useTokens();


let personas = ref(null)
let usedCategories = ref(null)
let skills = ref(null)

let selectedPersona = ref(null) //the actively selected persona

// by convention, composable function names start with "use"
export function usePersonas() {

    async function getPersonas() {
        try {
            var response = await configuredAxios.get(import.meta.env.VITE_API_URL + '/personas');
            personas.value = response.data.payload;
            //TODO enhance to receive the code as well
            console.log("Loaded Personas", personas.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function getSkills() {
        try {
            var response = await configuredAxios.get(import.meta.env.VITE_API_URL + '/personas/skills');
            skills.value = response.data.payload;

            //TODO enhance to receive the code as well
            console.log("Loaded Skills", skills.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }


    async function getUsedCategories() {
        try {
            var response = await configuredAxios.get(import.meta.env.VITE_API_URL + '/personas/categories');
            usedCategories.value = response.data.payload;

            //TODO enhance to receive the code as well
            console.log("Loaded Used Categories", usedCategories.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createPersonas(newPersonas) {
        try {
            if (!Array.isArray(newPersonas)) newPersonas = [newPersonas]
            var params = { personas: newPersonas }
            var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/personas', params);
            console.log(response.data.payload)
            // currentPersona.value = response;    
            notify({ group: "success", title: "Success", text: "Persona(s) created successfully" }, 4000) // 4s
            getPersonas();
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating persona(s). Try again" }, 4000) // 4s
        }
    }

    async function createNewPersonaAvatar(description) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { avatarPrompt: description }
                var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/personas/avatar', params);
                resolve(import.meta.env.VITE_STORAGE_URL + "/images/" + response.data.payload)
                getPersonas();
            }

            catch (error) {
                console.log("Error", error)
                reject(error)
            }
        })
    }

    async function updatePersonas(updatePersonas) {
        try {
            if (!Array.isArray(updatePersonas)) updatePersonas = [updatePersonas]
            var params = { personas: updatePersonas }
            var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/personas/update', params);
            console.log(response.data.payload)
            // currentPersona.value = response;    
            notify({ group: "success", title: "Success", text: "Persona(s) updated successfully" }, 4000) // 4s
            getPersonas();
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error updating persona(s). Try again" }, 4000) // 4s

        }
    }


    function addLink(personaId, personaLink, linkType) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("Adding persona link", personaLink)
                var params = { personaId, personaLink, linkType }
                var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/personas/addLink', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }


    function getPersonaLinkDetails(personaLink) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("Getting Persona details", personaLink)
                var params = { personaLink: personaLink }
                var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/personas/linkDetails', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function acceptPersonaLink(personaLink) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { personaLink: personaLink }
                var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/personas/acceptLink', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    // expose managed state as return value
    return {

        personas,
        selectedPersona,
        usedCategories,
        skills,

        getPersonas,
        getSkills,
        getUsedCategories,
        createPersonas,
        updatePersonas,

        createNewPersonaAvatar,

        addLink,
        getPersonaLinkDetails,
        acceptPersonaLink,

    }
}