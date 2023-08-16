
import { ref, onMounted, onUnmounted } from 'vue'



import axios from "axios";

// by convention, composable function names start with "use"
export function useProcessYouTube() {

    async function extractTitleEntities(items) {


        try {
            for (var a = 0; a < items.length; a++) {
                var response = await axios.post('http://localhost:3000/entities/extract', { item: items[a]})
                // items[a].entities = response.data.payload;
                console.log(a, response.data.payload)
            }
        }
        catch (error) {
            console.log("Error", error)
        }
        //sequentially get all the metadata for each video
        //Use OpenAI GPT 4 to resolve the metadata

        /* format
            "guests": "Vijay Kumar", --array
            "topic": "Flying Robots", 
            "host": "Lex Fridman", 
            "podcast_name": "Lex Fridman Podcast",
            "episode_number": 37
        */


    }

    function downloadYouTube(items) {
        //sequentially download each YouTube
        //Add a delay to not get 429'd
        //Save the files locally based on the ID of the video and the episode metadata
        //Return an OK when the video downloaded and a link to the file


    }

    function transcribeAudio(items) {
        //Extract out all the audio from each
        //Return an OK when the transcription is completed
    }


    // expose managed state as return value
    return {
        extractTitleEntities,
        downloadYouTube,
        transcribeAudio
    }
}