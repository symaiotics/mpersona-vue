<template>
    <div class="flex flex-wrap -mx-3 mb-1">

        <div class="w-full px-3">
            <button @click="add" class="btn text-white bg-teal-500 hover:bg-teal-400 flex items-center mb-3">
                <span>Reset</span>
            </button>
        </div>


        <!-- {{ localPersona.description.en }} -->
        <template v-if="localPersona">
            <div class="w-full m-2">

                <div v-if="!statusCreatingAvatar && localPersona.url">
                    <img :src="localPersona.url" alt="Avatar Image" class="object-cover mb-4 rounded-md w-48 h-48">
                </div>
                <div v-else>

                    <img :src="defaultImage" alt="Default avatar Image" class="object-cover  mb-4 rounded-md w-48 h-48">

                </div>


                <button v-if="localPersona.isAdmin || localPersona.isEditor || !localPersona._id"
                    @click="createNewAvatar(avatarPrompt)" :disabled="statusCreatingAvatar"
                    class="btn text-white bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">Generate
                    New Avatar</button>

                <p v-if="statusCreatingAvatar">Loading a new avatar... please wait</p>

            </div>
            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="avatarPrompt">
                    Avatar Prompt
                    <span class="text-red-600">*</span>
                </label>

                <input v-model="avatarPrompt" id="avatarPrompt" type="text" class="form-input w-full"
                    placeholder="Enter how you would like your avatar to look" required />
            </div>

            <div class="w-full  m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="first-name">
                    Persona Name
                    <span class="text-red-600">*</span>
                </label>
                <input v-model="localPersona.name" id="first-name" type="text" class="form-input w-full"
                    placeholder="Enter the name of the knowledge Profile" required />
            </div>

            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="persona-description">
                    Description
                    <span class="text-sm text-gray-500">Optional</span>
                </label>
                <input v-model="localPersona.description.en" id="persona-description" type="text" class="form-input w-full"
                    placeholder="Enter a brief description" required />
            </div>

            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="persona-url">
                    Image URL
                    <span class="text-sm text-gray-500">Optional</span>
                </label>
                <input v-model="localPersona.url" id="persona-url" type="text" class="form-input w-full"
                    placeholder="The link to your persona avatar" required />

            </div>


            <div class="w-full px-3">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="category">Category
                    <span class="text-sm text-gray-500">Optional</span></label>
                <select v-model="localPersona.categories" id="category" class="form-select w-full" required>
                    <option v-for="(category, index) in categories" :key="'category' + index" :value="[category]">{{
                        category.label.en }}
                    </option>
                </select>
            </div>

            <div class="w-full px-3">
                <div class="flex justify-between items-center mb-1">
                    <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium" for="message">
                        Persona Instructions
                    </label>
                    <span class="text-red-600">*</span>
                </div>
                <textarea v-model="localPersona.basePrompt" id="message" rows="8" class="form-textarea w-full"
                    placeholder="Define the persona instructions" required></textarea>
                <p> The Persona Instructions determine how the Large Language Model will conduct its interactions. Here,
                    you can define the rules by which it should operate, how it identifies itself, and the functions it
                    provides.</p>
            </div>


            <div class="w-full px-3 pt-3" v-if="localPersona._id">
                <p> See all contributors.</p>
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="border dark:border-gray-700 dark:text-gray-300">Owners</th>
                            <th class="border dark:border-gray-700 dark:text-gray-300">Editors</th>
                            <th class="border dark:border-gray-700 dark:text-gray-300">Viewers</th>
                            <th class="border dark:border-gray-700 dark:text-gray-300">Created By</th>
                            <th class="border dark:border-gray-700 dark:text-gray-300">Is Public</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border dark:border-gray-700 dark:text-gray-300">{{localPersona.owners}}</td>
                            <td class="border dark:border-gray-700 dark:text-gray-300">{{ localPersona.editors }}</td>
                            <td class="border dark:border-gray-700 dark:text-gray-300">{{ localPersona.viewers }}</td>
                            <td class="border dark:border-gray-700 dark:text-gray-300">{{ localPersona.createdBy }}</td>
                            <td class="border dark:border-gray-700 dark:text-gray-300">{{ localPersona.isPublic }}</td>
                        </tr>
                    </tbody>

                </table>
            </div>



            <div class="m-4 spacing-x-2">
                <div v-if="localPersona.isAdmin || localPersona.isOwner || localPersona.isEditor">
                    <label for="url" class="block mb-2 dark:text-gray-300">Viewer Link</label>
                    <p v-if="localPersona.viewerLink">{{ localPersona.viewerLink }}</p>
                    <div v-else>
                        There is no viewer link.
                    </div>
                    <div class="flex space-x-4">
                        <button @click="createLink('viewerLink')"
                            class="px-4 py-2 bg-blue-500 text-white dark:bg-blue-700">Create
                            Viewer Link</button>
                        <button v-if="localPersona.viewerLink" @click="copyToClipboard(localPersona.viewerLink)"
                            class="px-4 py-2 bg-gray-500 text-white dark:bg-gray-700">Copy Link</button>
                    </div>

                </div>

                <div v-if="localPersona.isAdmin || localPersona.isOwner || localPersona.isEditor">
                    <label for="url" class="block mb-2 dark:text-gray-300">Editor Link</label>
                    <p v-if="localPersona.editorLink">{{ localPersona.editorLink }}</p>
                    <div v-else>
                        There is no viewer link.
                    </div>
                    <div class="flex space-x-4">
                        <button @click="createLink('editorLink')"
                            class="px-4 py-2 bg-blue-500 text-white dark:bg-blue-700">Create
                            Editor Link</button>
                        <button v-if="localPersona.editorLink" @click="copyToClipboard(localPersona.editorLink)"
                            class="px-4 py-2 bg-gray-500 text-white dark:bg-gray-700">Copy Link</button>
                    </div>
                </div>
            </div>

            <div v-if="!localPersona?._id" class="w-full px-3">
                <button @click="create" class="btn text-white bg-teal-500 hover:bg-teal-400 w-full flex items-center mb-3">
                    <span>Create Persona</span>
                    <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-current"
                            d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                    </svg>
                </button>


                <div v-if="!token" class="w-full  text-center">
                    <p>
                        Note: You are <b>not</b> logged in, so any personas you create will be visible and usable by the
                        public.
                    </p>
                    <p>If you would like to keep your personas private, please <router-link to="/join"> make a free
                            account.</router-link></p>
                </div>

                <div v-if="token" class="w-full text-center">
                    <p>Since you are logged in, your personas will only be visible to you and anyone you share it with.</p>
                </div>

            </div>

            <div v-if="localPersona?._id && (localPersona.isAdmin || localPersona.isEditor)" class="w-full px-3">
                <button @click="triggerUpdate"
                    class="btn text-white bg-teal-500 hover:bg-teal-400 w-full flex items-center mb-3">
                    <span>Update Persona</span>
                </button>

                <button @click="triggerDelete"
                    class="btn text-white bg-yellow-500 hover:bg-yellow-400 w-full flex items-center mb-3">
                    <span>Delete Persona</span>
                </button>

            </div>

        </template>
    </div>
</template>

<script setup>

import { ref, onMounted, onBeforeMount } from 'vue';
import { generate, count } from "random-words";
import { notify } from "notiwind"
import { v4 as uuidv4 } from 'uuid';
import defaultImage from "../images/persona1.png"

//Composables
import { useTokens } from '@/composables/useTokens.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'

const { token } = useTokens()
const { newPersona, selectedPersona, defaultPersona, addNewPersona, createPersonas, updatePersonas, addLink, createNewPersonaAvatar, deletePersonas } = usePersonas()
const { categories, getCategories } = useCategories()

let avatarPrompt = ref('An attractive digital avatar, Pixar style 3D render of a friendly person smiling, inside, 4k, high resolution')
let statusCreatingAvatar = ref(false)

let props = defineProps({ persona: { type: Object } })
let emit = defineEmits(['changeTab'])
let localPersona = ref({})

onBeforeMount(() => {
    localPersona.value = defaultPersona;
})

onMounted(() => {
    getCategories();
    if (props.persona) localPersona.value = props.persona;
})

function add() {
    addNewPersona();;
    localPersona.value = newPersona.value;
}

function createNewAvatar(name) {
    statusCreatingAvatar.value = true;
    createNewPersonaAvatar(name).then((response) => {
        localPersona.value.url = response;
        statusCreatingAvatar.value = false;
    }).catch((error) => {
        statusCreatingAvatar.value = false;
        console.log("Error Creating Avatar", error)
    })
}

function create() {
    createPersonas([localPersona.value]);
}

function triggerUpdate() {
    updatePersonas([localPersona.value]);
}

function triggerDelete() {
    deletePersonas([localPersona.value]);
    emit('changeTab', 0)

}

function createLink(linkType) {
    if (selectedPersona.value.isEditor) {
        var words = generate({ exactly: 2, minLength: 5, maxLength: 20 }).join('-') + "_" + uuidv4();
        addLink(selectedPersona.value.uuid, words, linkType).then((response) => {
            notify({ group: "success", title: "Success", text: "Link added successfully" }, 4000) // 4s
            if (linkType == 'viewerLink') selectedPersona.value.viewerLink = words;
            if (linkType == 'editorLink') selectedPersona.value.editorLink = words;
        }).catch((error) => {
            notify({ group: "failure", title: "Error", text: "Link creation unsuccessful. Please try again." }, 4000) // 4s
        });
    }
}

async function copyToClipboard(text) {

    text = import.meta.env.VITE_SELF + "/linkPersona/" + text;
    try {
        await navigator.clipboard.writeText(text);
        notify({ group: "success", title: "Success", text: "Link copied" }, 4000) // 4s
    } catch (err) {
        notify({ group: "failure", title: "Error", text: "Error. Please try again." }, 4000) // 4s
    }
}

</script>