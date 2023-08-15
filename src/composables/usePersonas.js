// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'
import axios from "axios";

let personas = ref(null)
let usedCategories = ref(null)
let skills = ref(null)

let selectedPersona = ref(null) //the actively selected persona

// by convention, composable function names start with "use"
export function usePersonas() {

    async function getPersonas() {
        try {
            var response = await axios.get(import.meta.env.VITE_API_URL + '/personas');
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
            var response = await axios.get(import.meta.env.VITE_API_URL + '/personas/skills');
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
            var response = await axios.get(import.meta.env.VITE_API_URL + '/personas/categories');
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
            if(!Array.isArray(newPersonas)) newPersonas = [newPersonas]
            var params = {personas:newPersonas}
            var response = await axios.post(import.meta.env.VITE_API_URL + '/personas', params);  
            console.log(response.data.payload)      
            // currentPersona.value = response;    
            getPersonas();
        }
        catch (error) {
            console.log("Error", error)
        }
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
    }
}