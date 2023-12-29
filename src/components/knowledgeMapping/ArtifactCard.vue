<template>
    <div class="card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 m-4">

        <div v-if="props.data" class="card-content">

            <p v-if="props?.data?.prompt" class="w-full text-xl font-semibold dark:text-white">
                Prompt: {{ props.data.prompt.substring(0, 100) }}...
            </p>
            <p v-if="props?.data?.prompt" class="w-full  text-xl font-semibold dark:text-white">
                Message: {{ props.data.message.substring(0, 100) }}...
            </p>

            <!-- <h2 class="text-xl font-semibold dark:text-white">{{ props.data.name.en }}</h2> -->
            <p class="text-gray-600 dark:text-gray-400">Audited: {{ audited }}</p>
            <p class="text-gray-600 dark:text-gray-400">Chat: {{ hasChatHistory }}</p>
            <div class="scoring mt-4">
                <div class="score-item">
                    <span class="font-bold dark:text-white">Completeness:</span> {{ props.data.completeness }}
                </div>
                <div class="score-item">
                    <span class="font-bold dark:text-white">Accuracy:</span> {{ props.data.accuracy }}
                </div>
                <div class="score-item">
                    <span class="font-bold dark:text-white">Tone:</span> {{ props.data.tone }}
                </div>
                <div class="score-item">
                    <span class="font-bold dark:text-white">Overall:</span> {{ props.data.overall }}
                </div>
                <div class="score-item">
                    <span class="font-bold dark:text-white">Comments:</span> {{ props.data.comments }}
                </div>
            </div>


        </div>
        <div v-else class="text-center text-gray-600 dark:text-gray-400">
            No data available.
        </div>
    </div>
</template>
  
<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    data: Object
});

const audited = computed(() => props.data.auditJson !== null);
const hasChatHistory = computed(() => props.data.messageHistory && props.data.messageHistory.length > 0);

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};
</script>
  
<style scoped>
.card-content {
    /* max-width: 400px; */
}

.score-item {
    margin-bottom: 0.5rem;
}
</style>