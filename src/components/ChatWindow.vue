<template>
    <!-- {{ messages }} -->
    <div class="flex flex-col h-full overflow-y-auto p-4 space-y-4 dark:bg-gray-800" ref="chatContainer">
        <div v-for="(message, index) in messages" :key="message.id" class="flex"
            :class="{ 'justify-end': message.role == 'user' }">


            <div v-if="index > 0 || message.role == 'user'" :class="[message.role == 'user'
                ? ''
                : 'w-full']">
                <div class="py-2 px-4 rounded-lg " :class="[message.role == 'user'
                    ? 'bg-blue-500 text-white dark:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white']"
                    v-html="renderMarkdown(message.content)">
                </div>
            </div>

        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue';

import MarkdownIt from 'markdown-it';


const md = new MarkdownIt();
const partialMessageMarkdown = computed(() => {
    const md = new MarkdownIt();
    return md.render(partialMessage.value);
});

const completedMessageMarkdown = computed(() => {
    return md.render(completedMessage.value);
});

function renderMarkdown(text) {
    return md.render(text);
};


const props = defineProps({ messages: { type: Array, default: [] } })
const messages = computed(() => { return props.messages });
const chatContainer = ref(null);

// Function to always keep the chat scrolled to the bottom
const scrollToBottom = () => {
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};

onMounted(() => {
    // Initial scroll to the bottom
    scrollToBottom();

    // Scroll to the bottom every time a new message is added
    watch(() => messages.value, () => {
        nextTick(() => {
            scrollToBottom();
        });
    }, { deep: true });
});
</script>
  
<style>
/* Additional styles if needed */
</style>