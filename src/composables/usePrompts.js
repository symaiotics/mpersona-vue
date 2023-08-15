// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'
import axios from "axios";

var currentModel = ref(0)
var models = [
    "gpt-4",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo",
];

var temperature = ref(0)
var userPrompt = ref("")
var systemPrompt = ref("")
var promptResponse = ref(null)
var promptResponseCode = ref([])


// by convention, composable function names start with "use"
export function usePrompts() {
    async function simplePrompt() {
        try {
            var params = {
                userPrompt: userPrompt.value,
                systemPrompt: systemPrompt.value,
                model: models[currentModel.value],
                temperature: temperature.value
            }
            var response = await axios.post('http://localhost:3000/prompts', params);
            promptResponse.value = response.data.payload;

            //TODO enhance to receive the code as well
            console.log(promptResponse.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    // expose managed state as return value
    return {
        userPrompt,
        systemPrompt,
        models,
        currentModel,
        temperature,

        promptResponse,
        simplePrompt
    }
}